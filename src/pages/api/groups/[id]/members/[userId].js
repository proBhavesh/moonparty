import { supabase } from "../../../../../lib/supabase";

export default async function handler(req, res) {
  const { id: groupId, userId } = req.query;

  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Remove from group_members
    const { error: groupMemberError } = await supabase
      .from("group_members")
      .delete()
      .eq("user_id", userId)
      .eq("group_id", groupId);

    if (groupMemberError) {
      console.error("Error removing from group_members:", groupMemberError);
      return res
        .status(500)
        .json({
          message: "Error removing from group_members",
          error: groupMemberError.message,
        });
    }

    // Remove from daily_rankings
    const { error: dailyRankingsError } = await supabase
      .from("daily_rankings")
      .delete()
      .eq("user_id", userId)
      .eq("group_id", groupId);

    if (dailyRankingsError) {
      console.error("Error removing from daily_rankings:", dailyRankingsError);
      return res
        .status(500)
        .json({
          message: "Error removing from daily_rankings",
          error: dailyRankingsError.message,
        });
    }

    // If you need to remove from other tables, add those operations here
    // For example:
    // const { error: otherTableError } = await supabase
    //   .from("other_table")
    //   .delete()
    //   .eq("user_id", userId)
    //   .eq("group_id", groupId);
    //
    // if (otherTableError) {
    //   console.error("Error removing from other_table:", otherTableError);
    //   return res.status(500).json({ message: "Error removing from other_table", error: otherTableError.message });
    // }

    res
      .status(200)
      .json({ message: "Member removed successfully from all related tables" });
  } catch (error) {
    console.error("Unexpected error removing group member:", error);
    res
      .status(500)
      .json({
        message: "Unexpected error removing group member",
        error: error.message,
      });
  }
}
