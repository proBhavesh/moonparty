import { supabase } from "../../../../lib/supabase";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("group_members")
        .select(
          `
          user_id,
          group_id,
          joined_at,
          users (
            id,
            username,
            wallet_address,
            avatar_url
          )
        `
        )
        .eq("group_id", id);

      if (error) throw error;

      const members = data.map((item) => ({
        user_id: item.user_id,
        group_id: item.group_id,
        joined_at: item.joined_at,
        ...item.users,
      }));

      res.status(200).json(members);
    } catch (error) {
      console.error("Error fetching group members:", error);
      res.status(500).json({
        message: "Error fetching group members",
        error: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
