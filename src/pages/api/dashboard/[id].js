import { supabase } from "../../../lib/supabase";

export default async function handler(req, res) {
  const { id: userWallet } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("wallet_address", userWallet)
      .single();

    if (userError) {
      if (userError.code === "PGRST116") {
        return res.status(404).json({ message: "User not found" });
      }
      throw userError;
    }

    const { data: groupsData, error: groupsError } = await supabase
      .from("group_members")
      .select(
        `
        group_id,
        leaderboard_groups (
          id,
          name,
          created_by,
          invite_link,
          group_members (
            users (
              wallet_address,
              username
            )
          )
        )
      `
      )
      .eq("user_id", userData.id);

    if (groupsError) {
      throw groupsError;
    }

    const formattedGroups = groupsData.map((group) => ({
      ...group.leaderboard_groups,
      group_members: group.leaderboard_groups.group_members,
      members_count: group.leaderboard_groups.group_members.length,
    }));

    res.status(200).json(formattedGroups);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching group details", error: error.message });
  }
}
