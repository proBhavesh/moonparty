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
      .from("leaderboard_groups")
      .select(
        `
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
      `
      )
      .eq("created_by", userData.id);

    if (groupsError) {
      throw groupsError;
    }

    const formattedGroups = groupsData.map((group) => ({
      ...group,
      members_count: group.group_members.length,
    }));

    res.status(200).json(formattedGroups);
  } catch (error) {
    console.error("Error fetching created groups:", error);
    res
      .status(500)
      .json({ message: "Error fetching created groups", error: error.message });
  }
}
