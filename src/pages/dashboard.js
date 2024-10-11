import { useEffect, useState } from "react";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import Link from "next/link";

export default function Dashboard() {
  const { isAuthenticated, publicKey } = useWalletConnection();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (isAuthenticated && publicKey) {
      fetchUserGroups();
    }
  }, [isAuthenticated, publicKey]);

  const fetchUserGroups = async () => {
    try {
      const response = await fetch(`/api/dashboard/${publicKey}`);
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching user groups:", error);
    }
  };

  if (!isAuthenticated) {
    return <div>Please connect your wallet to view the dashboard.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
      {groups.length > 0 ? (
        <ul className="space-y-4">
          {groups.map((group) => (
            <li
              key={group.id}
              className="bg-white shadow overflow-hidden sm:rounded-md"
            >
              <Link
                href={`/group/${group.id}`}
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-purple-600 truncate">
                      {group.name}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {group.members_count} members
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>You havent joined any groups yet.</p>
      )}
      <div className="mt-6">
        <Link
          href="/create-group"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Create New Group
        </Link>
      </div>
    </div>
  );
}
