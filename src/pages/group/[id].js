import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWalletConnection } from "../../context/WalletConnectionProvider";
import LeaderboardTable from "../../components/LeaderboardTable";
import GroupInviteLink from "../../components/GroupInviteLink";
import AssetSnapshot from "../../components/AssetSnapshot";

export default function GroupDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, publicKey } = useWalletConnection();

  useEffect(() => {
    if (id && isAuthenticated) {
      fetchGroupDetails();
    }
  }, [id, isAuthenticated]);

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`/api/groups/${id}`);
      const data = await response.json();
      setGroup(data);
    } catch (error) {
      console.error("Error fetching group details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please connect your wallet to view group details.</div>;
  }

  if (!group) {
    return <div>Group not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">{group.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
          <LeaderboardTable groupId={id} />
        </div>
        <div>
          {/* <AssetSnapshot groupId={id} onSnapshotTaken={fetchGroupDetails} /> */}
          <GroupInviteLink inviteLink={group.invite_link} />
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900">Group Members</h3>
            <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
              {group.group_members.map((member) => (
                <li
                  key={member.users.wallet_address}
                  className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                >
                  <div className="w-0 flex-1 flex items-center">
                    <span className="ml-2 flex-1 w-0 truncate">
                      {member.users.username || "Anonymous"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
