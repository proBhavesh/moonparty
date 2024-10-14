import { useState, useEffect } from "react";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import Image from "next/image";

const UserProfile = ({ onClose }) => {
  const { user } = useWalletConnection();
  const [leaderboards, setLeaderboards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      if (!user?.wallet_address) return;

      try {
        const response = await fetch(
          `/api/user/leaderboards?walletAddress=${user.wallet_address}`
        );
        if (response.ok) {
          const data = await response.json();
          setLeaderboards(data);
        } else {
          console.error("Failed to fetch leaderboards");
        }
      } catch (error) {
        console.error("Error fetching leaderboards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboards();
  }, [user]);

  if (!user) {
    return null; // Or some loading state
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-purple-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">User Profile</h2>
          <button onClick={onClose} className="text-white">
            &times;
          </button>
        </div>
        <div className="flex items-center mb-4">
          <Image
            src="/sample-img.png"
            alt="User Avatar"
            width={64}
            height={64}
            className="rounded-full mr-4"
          />
          <div>
            <p className="text-xl font-semibold text-white">
              {user.username || "Anonymous"}
            </p>
            <p className="text-sm text-gray-300">{user.wallet_address}</p>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-white">
          Your Leaderboards
        </h3>
        {loading ? (
          <p className="text-white">Loading leaderboards...</p>
        ) : leaderboards.length > 0 ? (
          <ul className="space-y-2">
            {leaderboards.map((board) => (
              <li key={board.id} className="bg-purple-700 rounded p-3">
                <p className="text-lg font-semibold text-white">{board.name}</p>
                <p className="text-sm text-gray-300">Rank: {board.rank}</p>
                <p className="text-sm text-gray-300">
                  Daily Change: {board.daily_change_percentage.toFixed(2)}%
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white">
            You are not part of any leaderboards yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
