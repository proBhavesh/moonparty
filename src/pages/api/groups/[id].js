import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get the current date and the date 24 hours ago
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from("leaderboard_groups")
      .select(
        `
        *,
        group_members!inner (
          users!inner (
            wallet_address,
            username
          ),
          user_id
        ),
        daily_rankings!inner (
          user_id,
          daily_change_percentage,
          ranking_date
        )
      `
      )
      .eq("id", id)
      .eq("daily_rankings.group_id", id)
      .gte("daily_rankings.ranking_date", yesterday.toISOString().split("T")[0])
      .lte("daily_rankings.ranking_date", now.toISOString().split("T")[0]);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Process the data to get the latest daily_change_percentage for each user
    const processedData = {
      ...data[0],
      group_members: data[0].group_members.map((member) => {
        const userRankings = data
          .filter((d) => d.daily_rankings.user_id === member.user_id)
          .map((d) => ({
            daily_change_percentage: d.daily_rankings.daily_change_percentage,
            ranking_date: d.daily_rankings.ranking_date,
          }))
          .sort((a, b) => new Date(b.ranking_date) - new Date(a.ranking_date));

        const latestRanking = userRankings[0];

        return {
          ...member,
          daily_change_percentage: latestRanking
            ? latestRanking.daily_change_percentage
            : 0,
        };
      }),
    };

    res.status(200).json(processedData);
  } catch (error) {
    console.error("Error fetching group details:", error);
    res
      .status(500)
      .json({ message: "Error fetching group details", error: error.message });
  }
}
