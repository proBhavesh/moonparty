import { supabase } from "../../../lib/supabase";
import { updateDailyPnL } from "../../../lib/updateDailyPnL";

export default async function handler(req, res) {
  console.log("Join group API handler started");

  if (req.method !== "POST") {
    console.log(`Invalid method: ${req.method}`);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { inviteLink, userWallet } = req.body;
  console.log(
    `Received request: inviteLink=${inviteLink}, userWallet=${userWallet}`
  );

  if (!inviteLink || !userWallet) {
    console.log("Missing required fields");
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    console.log("Fetching user ID");
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("wallet_address", userWallet)
      .single();

    if (userError) {
      console.error("User not found:", userError);
      throw new Error("User not found");
    }

    const userId = userData.id;
    console.log(`User ID: ${userId}`);

    console.log("Fetching group data");
    const { data: groupData, error: groupError } = await supabase
      .from("leaderboard_groups")
      .select("id")
      .eq("invite_link", inviteLink)
      .single();

    if (groupError) {
      console.error("Invalid invite link:", groupError);
      throw new Error("Invalid invite link");
    }

    console.log(`Group ID: ${groupData.id}`);

    console.log("Checking if user is already a member");
    const { data: existingMember, error: memberCheckError } = await supabase
      .from("group_members")
      .select()
      .eq("user_id", userId)
      .eq("group_id", groupData.id)
      .single();

    if (existingMember) {
      console.log("User is already a member of this group");
      return res.status(400).json({
        message: "User is already a member of this group",
        groupId: groupData.id,
      });
    }

    console.log("Adding user to the group");
    const { data: newMember, error: addMemberError } = await supabase
      .from("group_members")
      .insert({ user_id: userId, group_id: groupData.id })
      .select()
      .single();

    if (addMemberError) {
      console.error("Error adding member:", addMemberError);
      throw addMemberError;
    }

    console.log("User successfully added to the group");
    // console.log("Updating P&L for the new user");
    // await updateDailyPnL(userId);

    console.log("Join process completed successfully");
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
