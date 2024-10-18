import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import UserProfile from "./UserProfile";
import PartySwitcher from "./PartySwitcher";
import { useWalletConnection } from "@/context/WalletConnectionProvider";
import { useParty } from "@/context/PartyContext";
import { useRouter } from "next/router";
import Loader from "./ui/Loader";

const Navbar = () => {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, publicKey } = useWalletConnection();
  const { selectedParty, userParties, selectParty } = useParty();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showPartySwitcher, setShowPartySwitcher] = useState(false);

  useEffect(() => {
    if (publicKey && !isAuthenticated && !isLoading) {
      router.push("/");
    }
  }, [isAuthenticated, publicKey, isLoading, router]);

  const toggleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };

  const togglePartySwitcher = () => {
    setShowPartySwitcher(!showPartySwitcher);
  };

  const handlePartySelect = (party) => {
    selectParty(party);
    setShowPartySwitcher(false);
    router.push(`/group/${party.id}`);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

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
