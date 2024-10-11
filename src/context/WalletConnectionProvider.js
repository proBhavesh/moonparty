import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletAuth } from "../hooks/useWalletAuth";
import { getAuthCookie } from "../lib/authCookies";

const WalletConnectionContext = createContext();

export const WalletConnectionProvider = ({ children }) => {
  const { publicKey, connected, disconnect } = useWallet();
  const {
    user,
    checkWalletExists,
    loginUser,
    logout: authLogout,
  } = useWalletAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const checkAndLoginUser = useCallback(async () => {
    if (!initialCheckDone) {
      const savedUser = getAuthCookie();
      if (savedUser) {
        await loginUser(savedUser);
      } else if (connected && publicKey) {
        const existingUser = await checkWalletExists(publicKey.toString());
        if (existingUser) {
          await loginUser(existingUser);
        }
      }
      setInitialCheckDone(true);
    }
  }, [connected, publicKey, checkWalletExists, loginUser, initialCheckDone]);

  useEffect(() => {
    checkAndLoginUser();
  }, [checkAndLoginUser]);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const logout = useCallback(() => {
    disconnect();
    authLogout();
  }, [disconnect, authLogout]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      publicKey: publicKey?.toString(),
      logout,
    }),
    [isAuthenticated, user, publicKey, logout]
  );

  return (
    <WalletConnectionContext.Provider value={value}>
      {children}
    </WalletConnectionContext.Provider>
  );
};

export const useWalletConnection = () => {
  const context = useContext(WalletConnectionContext);
  if (context === undefined) {
    throw new Error(
      "useWalletConnection must be used within a WalletConnectionProvider"
    );
  }
  return context;
};
