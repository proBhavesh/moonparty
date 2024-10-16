import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWalletConnection } from "../../context/WalletConnectionProvider";
import LeaderboardTable from "../../components/LeaderboardTable";
import GroupInviteLink from "../../components/GroupInviteLink";
import AssetSnapshot from "../../components/AssetSnapshot";
import TopUsers from "@/components/TopUsers";
import MembersList from "@/components/MembersList";
import Loader from "@/components/ui/Loader";

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
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <div>Please connect your wallet to view group details.</div>;
  }

  if (!group) {
    return <div>Group not found.</div>;
  }

  return (
    <div className="flex flex-col items-center mt-10 space-y-4">
      <TopUsers members={group.group_members} />
      {/* members */}
      <MembersList members={group.group_members} handleGroupClick={() => {}} />

      {/* <GroupInviteLink inviteLink={group.invite_link} /> */}
    </div>
  );
}
