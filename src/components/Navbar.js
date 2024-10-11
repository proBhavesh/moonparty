import Link from "next/link";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import WalletConnectButton from "./WalletConnectButton";
import { shortenAddress } from "../lib/solanaUtils";

const Navbar = () => {
  const { isAuthenticated, publicKey } = useWalletConnection();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              Solana Leaderboard
            </Link>
            {isAuthenticated && (
              <div className="ml-6 flex space-x-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  href="/create-group"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Create Group
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <span className="text-sm text-gray-500 mr-4">
                {shortenAddress(publicKey)}
              </span>
            ) : null}
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
