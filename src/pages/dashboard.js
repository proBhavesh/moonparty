import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import { useWalletConnection } from "../context/WalletConnectionProvider";

import CreateBtn from "@/components/ui/CreateBtn";
import PartyCard from "@/components/ui/PartyCard";

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
    <div className="flex flex-col items-center text-white">
      <h1 className="text-3xl mb-5">My Parties</h1>
      {groups.length > 0 ? (
        <ul className="space-y-4 w-[90%] md:w-[60%] lg:w-[50%]">
          {groups.map((group) => (
            <li key={group.id}>
              <PartyCard group={group} />
            </li>
          ))}
        </ul>
      ) : (
        <p>You have not joined any groups yet.</p>
      )}

      <div className="mt-5">
        <CreateBtn link={"/create-group"} text={"Create New Party"} />
      </div>
    </div>
  );
}
