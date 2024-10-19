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
  const [calculatingPnL, setCalculatingPnL] = useState(false);
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

      // Check if user data is available
      const userDataAvailable = data.group_members.some(
        (member) =>
          member.users.wallet_address === publicKey &&
          member.daily_change_percentage !== null
      );

      setCalculatingPnL(!userDataAvailable);

      if (!userDataAvailable) {
        // Start polling for updates
        pollForUpdates();
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
    } finally {
      setLoading(false);
    }
  };

  const pollForUpdates = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/groups/${id}`);
        const data = await response.json();
        const userDataAvailable = data.group_members.some(
          (member) =>
            member.users.wallet_address === publicKey &&
            member.daily_change_percentage !== null
        );

        if (userDataAvailable) {
          setGroup(data);
          setCalculatingPnL(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error polling for updates:", error);
      }
    }, 5000); // Poll every 5 seconds

    // Clear interval after 2 minutes (24 attempts)
    setTimeout(() => {
      clearInterval(interval);
      setCalculatingPnL(false); // Stop showing "Calculating PnL" even if data isn't available
    }, 120000);
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
      {calculatingPnL ? (
        <div className="text-white">Calculating your PnL...</div>
      ) : (
        <>
          <TopUsers members={group.group_members} />
          <MembersList members={group.group_members} />
        </>
      )}
      {/* <GroupInviteLink inviteLink={group.invite_link} /> */}
    </div>
  );
}
