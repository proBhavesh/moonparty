import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useWalletConnection } from "./WalletConnectionProvider";

const PartyContext = createContext();

export const PartyProvider = ({ children }) => {
  const [selectedParty, setSelectedParty] = useState(null);
  const [userParties, setUserParties] = useState([]); // All parties user is a member of
  const [createdParties, setCreatedParties] = useState([]); // Parties created by the user
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

      // Separate created parties and all parties
      const created = data.filter((party) => party.created_by === user.id);
      setCreatedParties(created);
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

  const updateSelectedParty = async (groupId) => {
    console.log("updateSelectedParty", groupId);
    console.log("userParties", userParties);
    const party = userParties.find(
      (p) => p.id.toString() === groupId.toString()
    );
    if (party) {
      setSelectedParty(party);
    } else {
      try {
        const response = await fetch(`/api/groups/${groupId}/details`);
        if (response.ok) {
          const groupDetails = await response.json();
          setSelectedParty({
            id: groupDetails.id,
            name: groupDetails.name,
          });
          setUserParties((prevParties) => [...prevParties, groupDetails]);
          if (groupDetails.created_by === user.id) {
            setCreatedParties((prevParties) => [...prevParties, groupDetails]);
          }
        } else {
          console.error("Failed to fetch group details");
        }
      } catch (error) {
        console.error("Error fetching group details:", error);
      }
    }
  };

  return (
    <PartyContext.Provider
      value={{
        selectedParty,
        userParties,
        createdParties,
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
