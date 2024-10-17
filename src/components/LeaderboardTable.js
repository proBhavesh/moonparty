import { useLeaderboard } from "../hooks/useLeaderboard";
import { formatCurrency } from "../lib/utils";
import { shortenAddress } from "../lib/solanaUtils";
import UserCard from "./ui/UserCard";
import Loader from "./ui/Loader";

const LeaderboardTable = ({ groupId }) => {
  const { leaderboard, loading } = useLeaderboard(groupId);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center mt-5 overflow-x-auto">
      {leaderboard.map((entry, index) => (
        <UserCard
          key={entry.users.wallet_address}
          id={index + 1}
          avatar={entry.users.avatar_url}
          name={entry.users.username}
          count={entry.daily_change_percentage}
        />
      ))}
    </div>
  );
};

export default LeaderboardTable;
