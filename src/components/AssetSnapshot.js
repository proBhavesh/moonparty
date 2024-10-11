import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { supabase } from "../lib/supabase";
import { formatCurrency } from "../lib/utils";

const AssetSnapshot = ({ groupId, onSnapshotTaken }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { publicKey } = useWallet();

  const takeSnapshot = async () => {
    if (!publicKey) return;

    setLoading(true);
    setError(null);

    try {
      // In a real application, you would fetch the actual wallet balance here
      const mockBalance = Math.random() * 10000; // Mock balance for demonstration

      const { data, error } = await supabase.from("asset_snapshots").insert({
        user_id: publicKey.toString(),
        group_id: groupId,
        total_value: mockBalance,
        snapshot_date: new Date().toISOString().split("T")[0], // Current date
      });

      if (error) throw error;

      onSnapshotTaken(data);
    } catch (err) {
      setError("Failed to take snapshot. Please try again.");
      console.error("Error taking snapshot:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900">
        Todays Asset Snapshot
      </h3>
      <button
        onClick={takeSnapshot}
        disabled={loading}
        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        {loading ? "Taking Snapshot..." : "Take Snapshot"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default AssetSnapshot;
