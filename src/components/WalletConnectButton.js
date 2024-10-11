import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

const WalletConnectButton = () => {
  const { publicKey, connected } = useWallet();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
        Connect Wallet
      </button>
    );
  }

  return (
    <WalletMultiButton className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
      {connected ? "Wallet Connected" : "Connect Wallet"}
    </WalletMultiButton>
  );
};

export default WalletConnectButton;
