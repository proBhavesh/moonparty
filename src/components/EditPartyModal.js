import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Copy } from "lucide-react";
import { generateInviteLink } from "../lib/utils";

const EditPartyModal = ({ isOpen, onClose, groupId, groupName }) => {
  const [members, setMembers] = useState([]);
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && groupId) {
      fetchGroupDetails();
      fetchMembers();
    }
  }, [isOpen, groupId]);

  const fetchGroupDetails = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/details`);
      if (response.ok) {
        const data = await response.json();
        setInviteLink(generateInviteLink(data.invite_link));
      } else {
        console.error("Failed to fetch group details");
      }
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        console.error("Failed to fetch members");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (userId) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMembers(members.filter((member) => member.user_id !== userId));
      } else {
        console.error("Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-purple-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Edit Party</h2>
          <button onClick={onClose} className="text-white">
            <X size={24} />
          </button>
        </div>
        <div className="mb-4">
          <input
            type="text"
            value={groupName}
            readOnly
            className="w-full p-2 bg-purple-700 text-white rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Invitation Link:</label>
          <div className="flex items-center">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-grow p-2 bg-purple-700 text-white rounded-l-md"
            />
            <button
              onClick={copyInviteLink}
              className="bg-red-500 text-white px-4 py-2 rounded-r-md flex items-center"
            >
              {copied ? (
                "Copied!"
              ) : (
                <>
                  <Copy size={16} className="mr-2" /> Copy
                </>
              )}
            </button>
          </div>
        </div>
        {loading ? (
          <p className="text-white">Loading members...</p>
        ) : (
          <ul className="space-y-2">
            {members.map((member) => (
              <li
                key={member.user_id}
                className="flex items-center justify-between bg-purple-700 rounded-md p-2"
              >
                <div className="flex items-center">
                  <Image
                    src={member.avatar || "/sample-img.png"}
                    alt={member.username}
                    width={32}
                    height={32}
                    className="rounded-full mr-2"
                  />
                  <span className="text-white">{member.username}</span>
                </div>
                <button
                  onClick={() => removeMember(member.user_id)}
                  className="text-white"
                >
                  <X size={20} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EditPartyModal;
