import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Copy } from "lucide-react";
import { generateInviteLink } from "../lib/utils";
import Loader from "./ui/Loader";

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
      <div className="rounded-3xl h-[95vh] md:h-[60vh] bg-primary-blue w-full max-w-md sm:max-w-xl m-5 flex flex-col overflow-y-scroll no-scrollbar p-5">
        <button className="flex justify-end w-full z-20 cursor-default">
          <X
            size={32}
            className="p-2 text-white rounded-full bg-dark-blue cursor-pointer"
            onClick={onClose}
          />
        </button>
        <div className="flex flex-col items-center gap-2 mb-4 -mt-8">
          <h2 className="text-xl font-medium">Edit Party</h2>
        </div>

        <div className="py-5 mb-4 bg-dark-blue rounded-3xl">
          <input
            type="text"
            value={groupName}
            readOnly
            className="flex-grow w-full text-xl text-center text-white bg-transparent"
          />
        </div>

        <div className="flex justify-between w-full px-3 py-4 mb-4 border border-dashed border-white/60 rounded-3xl">
          <input
            type="text"
            readOnly
            value={inviteLink}
            className={`flex bg-transparent text-white/60 w-60 md:w-96 truncate focus:outline-none`}
          />
          <button
            onClick={copyInviteLink}
            className="px-3 py-1 text-white rounded-full bg-primary-pink"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {loading ? (
          <p className="text-center text-white">
            <Loader />
          </p>
        ) : (
          <ul className="space-y-2">
            {members.map((member) => (
              <li
                key={member.user_id}
                className="flex items-center justify-between px-4 py-5 rounded-3xl bg-dark-blue"
              >
                <div className="flex items-center">
                  <Image
                    src={member.avatar_url || "/sample-img.png"}
                    alt={member.username}
                    width={32}
                    height={32}
                    className="mr-2 rounded-full"
                  />
                  <span className="text-white">{member.username}</span>
                </div>
                <button onClick={() => removeMember(member.user_id)}>
                  <X
                    size={32}
                    className="p-2 text-white rounded-full bg-primary-blue"
                  />
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
