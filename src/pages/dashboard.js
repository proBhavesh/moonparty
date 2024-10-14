import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import CreateBtn from "@/components/ui/CreateBtn";
import PartyCard from "@/components/ui/PartyCard";

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, publicKey, checkAndSetAuthState } =
    useWalletConnection();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDashboard = async () => {
      const authState = await checkAndSetAuthState();
      if (authState.isAuthenticated && authState.publicKey) {
        fetchUserGroups(authState.publicKey);
      } else {
        setLoading(false);
      }
    };

    initDashboard();
  }, [checkAndSetAuthState]);

  const fetchUserGroups = async (walletPublicKey) => {
    try {
      const response = await fetch(`/api/dashboard/${walletPublicKey}`);
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching user groups:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
        <p>You have not created any parties yet.</p>
      )}

      <div className="mt-5">
        <CreateBtn link={"/create-group"} text={"Create New Party"} />
      </div>
    </div>
  );
}
