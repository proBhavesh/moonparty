import { useWallet } from "@solana/wallet-adapter-react";
import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { setAuthCookie, removeAuthCookie } from "../lib/authCookies";

export const useWalletAuth = () => {
  const { publicKey, signMessage } = useWallet();
  const [user, setUser] = useState(null);

  const checkWalletExists = useCallback(async (walletAddress) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_address", walletAddress)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    } catch (error) {
      console.error("Error checking wallet:", error);
      return null;
    }
  }, []);

  const authenticateUser = useCallback(
    async (username, avatarUrl) => {
      if (!publicKey || !signMessage || !username) {
        console.log(
          "Cannot authenticate: missing publicKey, signMessage, or username"
        );
        return null;
      }

      try {
        const message = `Authenticate with Solana Wallet Leaderboard: ${new Date().toISOString()}`;
        const encodedMessage = new TextEncoder().encode(message);
        const signedMessage = await signMessage(encodedMessage);

        const { data, error } = await supabase
          .from("users")
          .upsert(
            {
              wallet_address: publicKey.toString(),
              username: username,
              avatar_url: avatarUrl,
            },
            {
              onConflict: "wallet_address",
              update: { username: username, avatar_url: avatarUrl },
            }
          )
          .select()
          .single();

        if (error) throw error;

        setUser(data);
        setAuthCookie(data);
        return data;
      } catch (error) {
        console.error("Error authenticating user:", error);
        return null;
      }
    },
    [publicKey, signMessage]
  );

  const loginUser = useCallback(async (userData) => {
    setUser(userData);
    setAuthCookie(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeAuthCookie();
  }, []);

  return { user, checkWalletExists, authenticateUser, loginUser, logout };
};
