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
  const [isLoading, setIsLoading] = useState(true);

  const checkAndSetAuthState = useCallback(async () => {
    setIsLoading(true);
    const authCookie = getAuthCookie();

    if (connected && publicKey) {
      const existingUser = await checkWalletExists(publicKey.toString());

      if (existingUser) {
        const loggedInUser = await loginUser(existingUser);
        setIsAuthenticated(true);
        setAuthCookie(loggedInUser);
        setIsLoading(false);
        return {
          isAuthenticated: true,
          publicKey: publicKey.toString(),
          user: loggedInUser,
        };
      } else {
        setIsAuthenticated(false);
        removeAuthCookie();
        setIsLoading(false);
        return {
          isAuthenticated: false,
          publicKey: publicKey.toString(),
          user: null,
        };
      }
    } else if (authCookie) {
      removeAuthCookie();
    }

    setIsAuthenticated(false);
    setIsLoading(false);
    return { isAuthenticated: false, publicKey: null, user: null };
  }, [connected, publicKey, checkWalletExists, loginUser]);

  useEffect(() => {
    checkAndSetAuthState();
  }, [checkAndSetAuthState, connected, publicKey]);

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
    isLoading,
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
