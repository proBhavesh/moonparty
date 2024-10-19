import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWalletConnection } from "../../../context/WalletConnectionProvider";
import { useParty } from "../../../context/PartyContext";
import LoadingAnimation from "@/components/ui/Loader";

export default function JoinGroup() {
  const router = useRouter();
  const { inviteLink } = router.query;
  const { isAuthenticated, publicKey, isLoading, checkAndSetAuthState } =
    useWalletConnection();
  const { fetchUserParties, updateSelectedParty } = useParty();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);
  const [isAlreadyMember, setIsAlreadyMember] = useState(false);
  const [groupId, setGroupId] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      await checkAndSetAuthState();
    };
    initAuth();
  }, [checkAndSetAuthState]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && inviteLink && publicKey) {
        joinGroup();
      } else if (!isAuthenticated) {
        setRedirectCountdown(3);
      }
    }
  }, [isLoading, isAuthenticated, inviteLink, publicKey]);

  useEffect(() => {
    let timer;
    if (redirectCountdown !== null && redirectCountdown > 0) {
      timer = setTimeout(
        () => setRedirectCountdown(redirectCountdown - 1),
        1000
      );
    } else if (redirectCountdown === 0) {
      if (isAlreadyMember && groupId) {
        router.push(`/group/${groupId}`);
      } else if (!isAuthenticated) {
        router.push(`/?pendingJoin=${inviteLink}`);
      }
    }
    return () => clearTimeout(timer);
  }, [
    redirectCountdown,
    router,
    isAlreadyMember,
    groupId,
    isAuthenticated,
    inviteLink,
  ]);

  const joinGroup = async () => {
    if (joining) return;
    if (!inviteLink || !publicKey) {
      setError("Missing invite link or wallet connection. Please try again.");
      return;
    }

    setJoining(true);
    setError(null);

    try {
      const response = await fetch("/api/groups/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviteLink,
          userWallet: publicKey,
        }),
      });

      const data = await response.json();

      if (
        response.status === 400 &&
        data.message.includes("already a member")
      ) {
        setIsAlreadyMember(true);
        setGroupId(data.groupId);
        await fetchUserParties(publicKey.toString(), data.groupId);
        updateSelectedParty(data.groupId);
        setRedirectCountdown(3);
      } else if (!response.ok) {
        throw new Error(data.message || "Failed to join group");
      } else if (!data.member || !data.member.group_id) {
        throw new Error("Invalid response from server");
      } else {
        await fetchUserParties(publicKey.toString(), data.member.group_id);
        updateSelectedParty(data.member.group_id);
        router.push(`/group/${data.member.group_id}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingAnimation />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <span className="block sm:inline">
            Please connect your wallet to join the group. Redirecting to home
            page in {redirectCountdown} seconds...
          </span>
        </div>
      </div>
    );
  }

  if (isAlreadyMember) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <span className="block sm:inline">
            You are already a member of this group. Redirecting to the group
            page in {redirectCountdown} seconds...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Join Group</h1>
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {joining ? (
        <div className="text-sm text-center text-white">
          <LoadingAnimation />
        </div>
      ) : (
        <button
          onClick={joinGroup}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          disabled={!inviteLink || !publicKey}
        >
          Join Group
        </button>
      )}
    </div>
  );
}
