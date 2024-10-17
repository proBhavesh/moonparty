import { useState, useEffect } from "react";
import { X } from "lucide-react";
import PartyCard from "./ui/PartyCard";
import CreateBtn from "./ui/CreateBtn";
import Loader from "./ui/Loader";
import { useRouter } from "next/router";
import { useWalletConnection } from "../context/WalletConnectionProvider";

const PartySwitcher = ({ onClose, onSelect }) => {
  const router = useRouter();
  const { user } = useWalletConnection();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    if (user?.wallet_address) {
      fetchUserGroups(user.wallet_address);
    }
  }, [user]);

  const fetchUserGroups = async (walletAddress) => {
    try {
      const response = await fetch(`/api/dashboard/${walletAddress}`);
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching user groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setCreateLoading(true);
    router.push("/create-group");
    onClose();
  };

  const handleGroupClick = (group) => {
    onSelect(group);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-3xl h-[95vh] md:h-[60vh] bg-primary-blue w-full max-w-md sm:max-w-xl m-5 flex flex-col overflow-y-scroll no-scrollbar p-5">
        <button className="flex justify-end w-full z-20 cursor-default">
          <X
            size={32}
            className="p-2 text-white rounded-full bg-dark-blue cursor-pointer"
            onClick={onClose}
          />
        </button>
        <h2 className="text-xl font-medium text-center text-white mb-4">
          My Parties
        </h2>
        {loading ? (
          <div className="flex-grow flex justify-center items-center">
            <Loader />
          </div>
        ) : groups.length > 0 ? (
          <ul className="flex-grow flex flex-col items-center space-y-2 overflow-y-auto">
            {groups.map((group) => (
              <li key={group.id} className="w-full">
                <PartyCard
                  group={group}
                  onClick={() => handleGroupClick(group)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-white">
            You have not created any parties yet.
          </p>
        )}
        <div className="mt-4">
          <CreateBtn
            onClick={handleCreateClick}
            loading={createLoading}
            text={"Create New Party"}
          />
        </div>
      </div>
    </div>
  );
};

export default PartySwitcher;
