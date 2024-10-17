import { useState } from "react";
import { Pencil } from "lucide-react";
import EditPartyModal from "../EditPartyModal";
import { useRouter } from "next/router";

function PartyCard({ group, onClick }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    onClick(group);
    router.push(`/group/${group.id}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div
        className="flex items-center justify-between w-screen max-w-xs p-3.5 text-white duration-300 bg-dark-blue rounded-3xl sm:max-w-lg hover:bg-primary-pink cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex flex-col justify-center">
          <span className="text-xl">{group.name}</span>
          <span className="text-base text-white/50">
            {group.members_count} members
          </span>
        </div>
        <button
          className="p-2 rounded-full bg-primary-blue"
          onClick={handleEditClick}
        >
          <Pencil />
        </button>
      </div>

      <EditPartyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        groupId={group.id}
        groupName={group.name}
        groupMembers={group.group_members}
      />
    </>
  );
}

export default PartyCard;
