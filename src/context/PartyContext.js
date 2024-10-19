// context/PartyContext.js

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

  const fetchUserParties = async (walletAddress, groupId = null) => {
    try {
      const response = await fetch(`/api/dashboard/${walletAddress}`);
      const data = await response.json();
      console.log("fetchUserParties", data);
      setUserParties(data);

      if (data.length > 0) {
        let partyToSelect;
        if (groupId) {
          partyToSelect = data.find(
            (party) => party.id.toString() === groupId.toString()
          );
        }
        if (!partyToSelect) {
          partyToSelect = data[0];
        }
        setSelectedParty(partyToSelect);
        if (!router.pathname.startsWith("/group/")) {
          router.push(`/group/${partyToSelect.id}`);
        }
      }
    } catch (error) {
      console.error("Error fetching user parties:", error);
    }
  };

  const selectParty = (party) => {
    setSelectedParty(party);
    router.push(`/group/${party.id}`);
  };

  const updateSelectedParty = (groupId) => {
    console.log("updateSelectedParty", groupId);
    console.log("userParties", userParties);
    const party = userParties.find(
      (p) => p.id.toString() === groupId.toString()
    );
    if (party) {
      setSelectedParty(party);
    }
  };

  return (
    <PartyContext.Provider
      value={{
        selectedParty,
        userParties,
        selectParty,
        fetchUserParties,
        updateSelectedParty,
      }}
    >
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
