import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import EditPartyModal from "../EditPartyModal";

function PartyCard({ group }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between w-screen max-w-xs p-3.5 text-white duration-300 bg-dark-blue rounded-3xl sm:max-w-lg hover:bg-primary-pink">
        <Link href={`/group/${group.id}`}>
          <div className="flex flex-col justify-center">
            <span className="text-xl">{group.name}</span>
            <span className="text-base text-white/50">
              {group.members_count} members
            </span>
          </div>
        </Link>
        <div>
          <button
            className="p-2 rounded-full bg-primary-blue"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil />
          </button>
        </div>
      </div>
      <EditPartyModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        groupId={group.id}
        groupName={group.name}
      />
    </>
  );
}

export default PartyCard;

//   md:max-w-lg w-screen max-w-md
