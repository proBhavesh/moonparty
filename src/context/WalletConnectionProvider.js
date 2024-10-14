import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletAuth } from "../hooks/useWalletAuth";
import {
  getAuthCookie,
  setAuthCookie,
  removeAuthCookie,
} from "../lib/authCookies";

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

  const checkAndSetAuthState = useCallback(async () => {
    const authCookie = getAuthCookie();
    if (authCookie && connected && publicKey) {
      const existingUser = await checkWalletExists(publicKey.toString());
      if (existingUser) {
        await loginUser(existingUser);
        setIsAuthenticated(true);
        setAuthCookie(existingUser);
        return { isAuthenticated: true, publicKey: publicKey.toString() };
      }
    }
    setIsAuthenticated(false);
    return { isAuthenticated: false, publicKey: null };
  }, [connected, publicKey, checkWalletExists, loginUser]);

  useEffect(() => {
    checkAndSetAuthState();
  }, [checkAndSetAuthState]);

  const logout = useCallback(() => {
    disconnect();
    authLogout();
    removeAuthCookie();
    setIsAuthenticated(false);
  }, [disconnect, authLogout]);

  const value = {
    isAuthenticated,
    user,
    publicKey: publicKey?.toString(),
    logout,
    checkAndSetAuthState,
  };

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
