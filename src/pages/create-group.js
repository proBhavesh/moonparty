import { useState } from "react";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import { useParty } from "../context/PartyContext";
import { useRouter } from "next/router";
import Loader from "@/components/ui/Loader";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, publicKey, user } = useWalletConnection();
  const { fetchUserParties, updateSelectedParty } = useParty();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!isAuthenticated) {
      setError("Please connect your wallet to create a group.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName,
          creatorWallet: publicKey,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create group");
      }

      const data = await response.json();

      // Update the party list and select the new party
      await fetchUserParties(publicKey, data.id);
      await updateSelectedParty(data.id);

      router.push(`/group/${data.id}`);
    } catch (error) {
      console.error("Error creating group:", error);
      setError("Failed to create group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Please connect your wallet to create a group.</div>;
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center mt-10 space-y-4"
      >
        <div>
          <input
            type="text"
            required
            name="groupName"
            value={groupName}
            placeholder="Party Name..."
            onChange={(e) => setGroupName(e.target.value)}
            className="w-screen max-w-md py-5 text-center text-white placeholder-purple-300 md:max-w-lg rounded-3xl bg-dark-blue"
          />
        </div>

        {error && <p className="text-white text-md">{error}</p>}

        <div className="">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary-pink hover:bg-primary-pink/90 duration-300 rounded-3xl justify-center items-center gap-3.5 inline-flex w-screen max-w-md md:max-w-lg py-5"
          >
            {isLoading ? (
              <div className="flex items-center justify-center w-6 h-6">
                <Loader size={24} />
              </div>
            ) : (
              <span className="text-center text-white text-md">
                Create New Party
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
