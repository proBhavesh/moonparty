import { supabase } from "../../../lib/supabase";
import { updateDailyPnL } from "../../../lib/updateDailyPnL";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { inviteLink, userWallet } = req.body;

  if (!inviteLink || !userWallet) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Fetch the user ID using the wallet address
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("wallet_address", userWallet)
      .single();

    if (userError) {
      throw new Error("User not found");
    }

    const userId = userData.id;

    // Fetch the group using the invite link
    const { data: groupData, error: groupError } = await supabase
      .from("leaderboard_groups")
      .select("id")
      .eq("invite_link", inviteLink)
      .single();

    if (groupError) {
      throw new Error("Invalid invite link");
    }

    // Check if the user is already a member of the group
    const { data: existingMember, error: memberCheckError } = await supabase
      .from("group_members")
      .select()
      .eq("user_id", userId)
      .eq("group_id", groupData.id)
      .single();

    if (existingMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this group" });
    }

    // Add user to the group
    const { data: newMember, error: addMemberError } = await supabase
      .from("group_members")
      .insert({ user_id: userId, group_id: groupData.id })
      .select()
      .single();

    if (addMemberError) throw addMemberError;

    // Update P&L for the new user
    // await updateDailyPnL(userId);

    res
      .status(200)
      .json({ message: "Successfully joined the group", member: newMember });
  } catch (error) {
    console.error("Error joining group:", error);
    res
      .status(500)
      .json({ message: "Error joining group", error: error.message });
  }
}
