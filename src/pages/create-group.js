import { useState } from "react";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import { useRouter } from "next/router";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState(null);
  const { isAuthenticated, publicKey } = useWalletConnection();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError("Please connect your wallet to create a group.");
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
      router.push(`/group/${data.id}`);
    } catch (error) {
      console.error("Error creating group:", error);
      setError("Failed to create group. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return <div>Please connect your wallet to create a group.</div>;
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Group</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="groupName"
            className="block text-sm font-medium text-gray-700"
          >
            Group Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="groupName"
              id="groupName"
              required
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="shadow-sm focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Create Group
          </button>
        </div>
      </form>
    </div>
  );
}
