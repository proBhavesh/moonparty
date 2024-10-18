import { useState, useEffect } from "react";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import { useParty } from "../context/PartyContext";
import Image from "next/image";
import { useRouter } from "next/router";
import { removeAuthCookie } from "../lib/authCookies";
import { X } from "lucide-react";
import LeaderboardList from "./LeaderboardList";
import Loader from "./ui/Loader";
import { shortenAddress } from "../lib/solanaUtils";

const UserProfile = ({ onClose }) => {
  const router = useRouter();
  const { user, logout } = useWalletConnection();
  const { selectParty } = useParty();
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

  const handleGroupClick = (leaderboard) => {
    // Ensure we have the correct structure for the party
    const party = {
      id: leaderboard.id,
      name: leaderboard.name,
      // Add any other necessary fields here
    };
    selectParty(party);
    router.push(`/group/${party.id}`);
    onClose();
  };

  const handleLogout = () => {
    removeAuthCookie();
    logout();
    onClose();
    router.push("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-3xl h-[95vh] md:h-[60vh] bg-primary-blue w-full max-w-md sm:max-w-xl m-5 flex flex-col">
        <div className="flex-shrink-0 px-1 py-2 sm:p-5">
          <button className="flex justify-end w-full cursor-default">
            <X
              size={32}
              className="z-20 p-2 text-white rounded-full cursor-pointer bg-dark-blue"
              onClick={onClose}
            />
          </button>

          <div className="flex flex-col items-center gap-2 -mt-5">
            <Image
              src={user.avatar_url || "/sample-img.png"}
              alt="User Avatar"
              width={64}
              height={64}
              className="rounded-full"
            />

            <div className="text-center">
              <p className="text-xl text-white">
                {user.username || "Anonymous"}
              </p>

              <div className="w-full p-3.5 text-white border-2 border-white border-dashed rounded-3xl bg-primary-blue focus:outline-none mt-2">
                <p className="text-sm text-white/60">
                  {shortenAddress(user.wallet_address)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow px-1 py-2 overflow-y-auto sm:px-5">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader />
            </div>
          ) : leaderboards.length > 0 ? (
            <LeaderboardList
              members={leaderboards}
              handleGroupClick={handleGroupClick}
            />
          ) : (
            <p className="text-center text-white">
              You are not part of any leaderboards yet!
            </p>
          )}
        </div>

        <div className="flex-shrink-0 p-5">
          <button
            onClick={handleLogout}
            className="w-full py-3 text-white transition-colors duration-200 rounded-2xl bg-primary-pink hover:bg-primary-pink/90"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
