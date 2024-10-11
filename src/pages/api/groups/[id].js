import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { data, error } = await supabase
      .from("leaderboard_groups")
      .select(
        `
        *,
        group_members (
          users (
            wallet_address,
            username
          )
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching group details:", error);
    res.status(500).json({ message: "Error fetching group details" });
  }
}
