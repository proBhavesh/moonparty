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

    const { data: leaderboards, error } = await supabase
      .from("daily_rankings")
      .select(
        `
        group_id,
        rank,
        daily_change_percentage,
        leaderboard_groups (
          id,
          name
        )
      `
      )
      .eq("user_id", userData.id)
      .eq("ranking_date", new Date().toISOString().split("T")[0]);

    if (error) throw error;

    const formattedLeaderboards = leaderboards.map((board) => ({
      id: board.leaderboard_groups.id,
      name: board.leaderboard_groups.name,
      rank: board.rank,
      daily_change_percentage: board.daily_change_percentage,
    }));

    res.status(200).json(formattedLeaderboards);
  } catch (error) {
    console.error("Error fetching user leaderboards:", error);
    res
      .status(500)
      .json({ message: "Error fetching leaderboards", error: error.message });
  }
}
