import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWalletConnection } from "../../../context/WalletConnectionProvider";
import { getAuthCookie } from "../../../lib/authCookies";
import LoadingAnimation from "@/components/ui/Loader";

export default function JoinGroup() {
  const router = useRouter();
  const { inviteLink } = router.query;
  const { isAuthenticated, publicKey } = useWalletConnection();
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authCookie = getAuthCookie();
    if (!authCookie) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated && inviteLink && publicKey) {
      joinGroup();
    }
  }, [isAuthenticated, inviteLink, publicKey]);

  const joinGroup = async () => {
    if (joining) return;
    if (!inviteLink || !publicKey) {
      setError("Missing invite link or wallet connection. Please try again.");
      return;
    }

    setJoining(true);
    setError(null);

    console.log("inviteLink", inviteLink);
    console.log("userWallet", publicKey);

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

      if (!response.ok) {
        throw new Error(data.message || "Failed to join group");
      }

      if (!data.member || !data.member.group_id) {
        throw new Error("Invalid response from server");
      }

      router.push(`/dashboard`);
    } catch (err) {
      setError(err.message);
    } finally {
      setJoining(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4"
          role="alert"
        >
          <span className="block sm:inline">
            Please connect your wallet to join the group.
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
