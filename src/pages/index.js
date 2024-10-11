import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import { useWalletAuth } from "../hooks/useWalletAuth";
import dynamic from "next/dynamic";

const WalletConnectButton = dynamic(
  () => import("../components/WalletConnectButton"),
  { ssr: false }
);

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, publicKey } = useWalletConnection();
  const { checkWalletExists, authenticateUser, loginUser } = useWalletAuth();
  const [username, setUsername] = useState("");
  const [walletChecked, setWalletChecked] = useState(false);

  const checkWallet = useCallback(async () => {
    if (publicKey && !walletChecked) {
      const existingUser = await checkWalletExists(publicKey);
      if (existingUser) {
        await loginUser(existingUser);
      }
      setWalletChecked(true);
    }
  }, [publicKey, walletChecked, checkWalletExists, loginUser]);

  useEffect(() => {
    checkWallet();
  }, [checkWallet]);

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const handleCreate = async () => {
    if (username && publicKey) {
      const user = await authenticateUser(username);
      if (user) {
        router.push("/dashboard");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-700 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">🌙 moonparty</h1>

        <div className="bg-purple-600 rounded-full w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <div className="text-4xl">😊</div>
        </div>

        {!publicKey ? (
          <div className="mb-4">
            <WalletConnectButton />
          </div>
        ) : walletChecked && !user ? (
          <>
            <input
              type="text"
              placeholder="Add a username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full max-w-md px-4 py-2 mb-4 bg-purple-500 rounded-full text-white placeholder-purple-300"
            />
            <button
              onClick={handleCreate}
              disabled={!username}
              className={`w-full max-w-md px-4 py-2 rounded-full ${
                username
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-purple-500 cursor-not-allowed"
              } transition-colors duration-200`}
            >
              Create Account
            </button>
          </>
        ) : (
          <p>Checking wallet...</p>
        )}
      </div>
    </div>
  );
}
