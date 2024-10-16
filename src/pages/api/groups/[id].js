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

    // First, fetch the group data
    const { data: groupData, error: groupError } = await supabase
      .from("leaderboard_groups")
      .select("*")
      .eq("id", id)
      .single();

    if (groupError) throw groupError;

    if (!groupData) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Then, fetch the group members
    const { data: membersData, error: membersError } = await supabase
      .from("group_members")
      .select(
        `
        *,
        users (
          wallet_address,
          username
        )
      `
      )
      .eq("group_id", id);

    if (membersError) throw membersError;

    // Finally, fetch the daily rankings
    const { data: rankingsData, error: rankingsError } = await supabase
      .from("daily_rankings")
      .select("*")
      .eq("group_id", id)
      .gte("ranking_date", yesterday.toISOString().split("T")[0])
      .lte("ranking_date", now.toISOString().split("T")[0]);

    if (rankingsError) throw rankingsError;

    // Process the data to get the latest daily_change_percentage for each user
    const processedMembers = membersData.map((member) => {
      const userRankings = rankingsData
        .filter((ranking) => ranking.user_id === member.user_id)
        .sort((a, b) => new Date(b.ranking_date) - new Date(a.ranking_date));

      const latestRanking = userRankings[0];

      return {
        ...member,
        daily_change_percentage: latestRanking
          ? latestRanking.daily_change_percentage
          : 0,
      };
    });

    const processedData = {
      ...groupData,
      group_members: processedMembers,
    };

    res.status(200).json(processedData);
  } catch (error) {
    console.error("Error fetching group details:", error);
    res
      .status(500)
      .json({ message: "Error fetching group details", error: error.message });
  }
}
