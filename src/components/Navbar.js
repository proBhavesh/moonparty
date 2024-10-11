import { useState } from "react";
import Image from "next/image";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import WalletConnectButton from "./WalletConnectButton";

const Navbar = () => {
  const { isAuthenticated, logout } = useWalletConnection();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold">🌙 moonparty</span>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button onClick={toggleDropdown} className="focus:outline-none">
                <Image
                  src="/sample-avatar.png" // Make sure to add this image to your public folder
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <WalletConnectButton />
                  {isAuthenticated && (
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
