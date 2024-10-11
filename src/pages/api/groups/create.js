import { supabase } from "../../../lib/supabase";
import crypto from "crypto";

function generateInviteLink() {
  return crypto.randomBytes(16).toString("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, creatorWallet } = req.body;

  if (!name || !creatorWallet) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Fetch the user ID using the wallet address
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("wallet_address", creatorWallet)
      .single();

    if (userError) {
      throw new Error("User not found");
    }

    const userId = userData.id;
    const inviteLink = generateInviteLink();

    // Create the leaderboard group
    const { data: groupData, error: groupError } = await supabase
      .from("leaderboard_groups")
      .insert({ name, created_by: userId, invite_link: inviteLink })
      .select()
      .single();

    if (groupError) throw groupError;

    // Add creator to the group
    const { error: memberError } = await supabase
      .from("group_members")
      .insert({ user_id: userId, group_id: groupData.id });

    if (memberError) throw memberError;

    res.status(200).json({ ...groupData, invite_link: inviteLink });
  } catch (error) {
    console.error("Error creating group:", error);
    res
      .status(500)
      .json({ message: "Error creating group", error: error.message });
  }
}
