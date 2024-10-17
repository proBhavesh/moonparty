import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import UserProfile from "./UserProfile";
import PartySwitcher from "./PartySwitcher";
import { useWalletConnection } from "@/context/WalletConnectionProvider";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();
  const { user } = useWalletConnection();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showPartySwitcher, setShowPartySwitcher] = useState(false);
  const [selectedParty, setSelectedParty] = useState(null);
  const [userParties, setUserParties] = useState([]);

  useEffect(() => {
    if (user?.wallet_address) {
      fetchUserParties(user.wallet_address);
    }
  }, [user]);

  const fetchUserParties = async (walletAddress) => {
    try {
      const response = await fetch(`/api/dashboard/${walletAddress}`);
      const data = await response.json();
      setUserParties(data);
      if (data.length > 0 && !selectedParty) {
        const firstParty = data[0]; // Select the first party instead of a random one
        setSelectedParty(firstParty);
        router.push(`/group/${firstParty.id}`);
      }
    } catch (error) {
      console.error("Error fetching user parties:", error);
    }
  };

  const toggleUserProfile = () => setShowUserProfile(!showUserProfile);
  const togglePartySwitcher = () => setShowPartySwitcher(!showPartySwitcher);

  const handlePartySelect = (party) => {
    setSelectedParty(party);
    setShowPartySwitcher(false);
    router.push(`/group/${party.id}`);
  };

  return (
    <nav className="h-16 px-6 py-3.5 justify-center items-center gap-3.5 inline-flex w-full">
      <div className="flex items-center justify-start grow shrink basis-0 h-9">
        <button onClick={togglePartySwitcher} className="flex items-center">
          <span className="text-2xl text-center text-white">
            {selectedParty ? selectedParty.name : "Select a Party"}
          </span>
          <ChevronDown className="text-white" size={30} />
        </button>
      </div>
      <button
        onClick={toggleUserProfile}
        className="focus:outline-none flex flex-col items-center"
      >
        <Image
          width={40}
          height={40}
          alt="User Avatar"
          src={user?.avatar_url || "/sample-img.png"}
          className="w-10 h-10 rounded-full"
        />
      </button>

      {showPartySwitcher && (
        <PartySwitcher
          onClose={togglePartySwitcher}
          onSelect={handlePartySelect}
          parties={userParties}
        />
      )}

      {showUserProfile && <UserProfile onClose={toggleUserProfile} />}
    </nav>
  );
};

export default Navbar;
