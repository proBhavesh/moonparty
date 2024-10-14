import { supabase } from "../../lib/supabase";
import axios from "axios";

async function getWalletBalance(walletAddress) {
  try {
    const response = await axios.get(
      `https://openapiv1.coinstats.app/wallet/balance?address=${walletAddress}&connectionId=solana`,
      {
        headers: {
          "X-API-KEY": process.env.NEXT_PUBLIC_COINSTATS_API_KEY,
          accept: "application/json",
        },
      }
    );

    const solData = response.data.find((coin) => coin.coinId === "solana");
    return {
      amount: solData.amount,
      price: solData.price,
    };
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id, wallet_address");

    if (userError) throw userError;

    const today = new Date().toISOString().split("T")[0];

    for (const user of users) {
      const { amount: solAmount, price: solPrice } = await getWalletBalance(
        user.wallet_address
      );
      const currentValueUSD = solAmount * solPrice;

      // Insert or update asset snapshot
      const { error: snapshotError } = await supabase
        .from("asset_snapshots")
        .upsert(
          {
            user_id: user.id,
            total_value: currentValueUSD,
            sol_amount: solAmount,
            sol_price_usd: solPrice,
            snapshot_date: today,
          },
          {
            onConflict: "user_id, snapshot_date",
          }
        );

      if (snapshotError) throw snapshotError;

      // Get yesterday's snapshot
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
        .toISOString()
        .split("T")[0];
      const { data: yesterdaySnapshot } = await supabase
        .from("asset_snapshots")
        .select("total_value, sol_amount, sol_price_usd")
        .eq("user_id", user.id)
        .eq("snapshot_date", yesterday)
        .single();

      let yesterdayValueUSD = currentValueUSD;
      if (yesterdaySnapshot) {
        yesterdayValueUSD = yesterdaySnapshot.total_value;
      }

      // Calculate daily change
      const dailyChangeValue = currentValueUSD - yesterdayValueUSD;
      const dailyChangePercentage =
        yesterdayValueUSD !== 0
          ? (dailyChangeValue / yesterdayValueUSD) * 100
          : 0;

      // Fetch all groups the user is a member of
      const { data: userGroups } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user.id);

      for (const { group_id } of userGroups) {
        // Insert or update daily ranking for each group
        await supabase.from("daily_rankings").upsert(
          {
            user_id: user.id,
            group_id,
            ranking_date: today,
            current_balance: currentValueUSD,
            sol_amount: solAmount,
            sol_price_usd: solPrice,
            daily_change_percentage: dailyChangePercentage,
            daily_change_value: dailyChangeValue,
            rank: 0, // We'll update ranks in a separate step
          },
          {
            onConflict: "user_id, group_id, ranking_date",
          }
        );
      }
    }

    // Update ranks for each group
    const { data: groups } = await supabase
      .from("leaderboard_groups")
      .select("id");

    for (const { id: group_id } of groups) {
      const { data: groupRankings } = await supabase
        .from("daily_rankings")
        .select("id, daily_change_percentage")
        .eq("group_id", group_id)
        .eq("ranking_date", today)
        .order("daily_change_percentage", { ascending: false });

      for (let i = 0; i < groupRankings.length; i++) {
        await supabase
          .from("daily_rankings")
          .update({ rank: i + 1 })
          .eq("id", groupRankings[i].id);
      }
    }

    res
      .status(200)
      .json({ message: "Daily P&L update completed successfully" });
  } catch (error) {
    console.error("Error updating daily P&L:", error);
    res
      .status(500)
      .json({ message: "Error updating daily P&L", error: error.message });
  }
}
