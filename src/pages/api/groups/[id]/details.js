import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("leaderboard_groups")
        .select("id, name, invite_link")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ message: "Group not found" });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching group details:", error);
      res
        .status(500)
        .json({
          message: "Error fetching group details",
          error: error.message,
        });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
