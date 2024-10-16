import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { walletAddress } = req.query;

  if (!walletAddress) {
    return res.status(400).json({ message: "Wallet address is required" });
  }

  try {
    // First, get the user's ID from their wallet address
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("wallet_address", walletAddress)
      .single();

    if (userError) throw userError;

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the user's groups from group_members
    const { data: userGroups, error: groupError } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", userData.id);

    if (groupError) throw groupError;

    if (!userGroups || userGroups.length === 0) {
      return res.status(200).json([]); // User is not a member of any groups
    }

    // Extract group IDs
    const groupIds = userGroups.map((group) => group.group_id);

    // Fetch the latest daily rankings for the user in their groups
    const { data: leaderboards, error: rankingError } = await supabase
      .from("daily_rankings")
      .select(
        `
        group_id,
        rank,
        daily_change_percentage,
        ranking_date,
        leaderboard_groups (
          id,
          name
        )
      `
      )
      .eq("user_id", userData.id)
      .in("group_id", groupIds)
      .order("ranking_date", { ascending: false })
      .order("rank", { ascending: true });

    if (rankingError) throw rankingError;

    // Create a Map to store unique leaderboards (latest ranking for each group)
    const uniqueLeaderboards = new Map();

    leaderboards.forEach((board) => {
      const key = board.group_id;
      if (!uniqueLeaderboards.has(key)) {
        uniqueLeaderboards.set(key, {
          id: board.leaderboard_groups.id,
          name: board.leaderboard_groups.name,
          rank: board.rank,
          daily_change_percentage: board.daily_change_percentage,
          last_ranking_date: board.ranking_date,
        });
      }
    });

    const formattedLeaderboards = Array.from(uniqueLeaderboards.values());

    res.status(200).json(formattedLeaderboards);
  } catch (error) {
    console.error("Error fetching user leaderboards:", error);
    res
      .status(500)
      .json({ message: "Error fetching leaderboards", error: error.message });
  }
}
