import { useLeaderboard } from "../hooks/useLeaderboard";
import { formatCurrency } from "../lib/utils";
import { shortenAddress } from "../lib/solanaUtils";

const LeaderboardTable = ({ groupId }) => {
  const { leaderboard, loading } = useLeaderboard(groupId);

  if (loading) {
    return <div>Loading leaderboard...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Daily Change %
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Daily Change $
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leaderboard.map((entry) => (
            <tr key={entry.users.wallet_address}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.rank}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {entry.users.username || "Anonymous"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {shortenAddress(entry.users.wallet_address)}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {entry.daily_change_percentage.toFixed(2)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatCurrency(entry.daily_change_value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
