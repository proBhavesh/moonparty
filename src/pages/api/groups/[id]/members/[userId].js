import { supabase } from "../../../../../lib/supabase";

export default async function handler(req, res) {
  const { id, userId } = req.query;

  if (req.method === "DELETE") {
    try {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("user_id", userId)
        .eq("group_id", id);

      if (error) throw error;

      res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
      console.error("Error removing group member:", error);
      res
        .status(500)
        .json({ message: "Error removing group member", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
