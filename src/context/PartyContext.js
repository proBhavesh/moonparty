import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWalletConnection } from "./WalletConnectionProvider";

const PartyContext = createContext();

export const PartyProvider = ({ children }) => {
  const [selectedParty, setSelectedParty] = useState(null);
  const [userParties, setUserParties] = useState([]);
  const { user, isAuthenticated } = useWalletConnection();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.wallet_address) {
      fetchUserParties(user.wallet_address);
    }
  }, [isAuthenticated, user]);

  const fetchUserParties = async (walletAddress) => {
    try {
      const response = await fetch(`/api/dashboard/${walletAddress}`);
      const data = await response.json();
      setUserParties(data);
      if (data.length > 0 && !selectedParty) {
        setSelectedParty(data[0]);
        router.push(`/group/${data[0].id}`);
      }
    } catch (error) {
      console.error("Error fetching user parties:", error);
    }
  };

  const selectParty = (party) => {
    setSelectedParty(party);
    router.push(`/group/${party.id}`);
  };

  return (
    <PartyContext.Provider value={{ selectedParty, userParties, selectParty }}>
      {children}
    </PartyContext.Provider>
  );
};

export const useParty = () => {
  const context = useContext(PartyContext);
  if (context === undefined) {
    throw new Error("useParty must be used within a PartyProvider");
  }
  return context;
};
