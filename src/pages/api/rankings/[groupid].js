import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  const { groupId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { data, error } = await supabase
      .from("daily_rankings")
      .select(
        `
        *,
        users (
          wallet_address,
          username
        )
      `
      )
      .eq("group_id", groupId)
      .order("rank", { ascending: true });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching rankings:", error);
    res.status(500).json({ message: "Error fetching rankings" });
  }
}
