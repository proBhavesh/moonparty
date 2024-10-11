import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useWallet } from "@solana/wallet-adapter-react";

export const useLeaderboard = (groupId) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { publicKey } = useWallet();

  useEffect(() => {
    if (groupId && publicKey) {
      fetchLeaderboard();
    }
  }, [groupId, publicKey]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("daily_rankings")
        .select(
          "users(username, wallet_address), daily_change_percentage, daily_change_value, rank"
        )
        .eq("group_id", groupId)
        .order("rank", { ascending: true });

      if (error) throw error;

      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return { leaderboard, loading, refreshLeaderboard: fetchLeaderboard };
};
