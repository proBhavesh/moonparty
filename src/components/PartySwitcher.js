import { useState } from "react";
import { X } from "lucide-react";
import PartyCard from "./ui/PartyCard";
import CreateBtn from "./ui/CreateBtn";
import { useRouter } from "next/router";

const PartySwitcher = ({ onClose, onSelect, parties }) => {
  const router = useRouter();
  const [createLoading, setCreateLoading] = useState(false);

  const handleCreateClick = () => {
    setCreateLoading(true);
    router.push("/create-group");
    onClose();
  };

  const handleGroupClick = (group) => {
    onSelect(group);
    onClose();
    router.push(`/group/${group.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-3xl h-[95vh] md:h-[60vh] bg-primary-blue w-full max-w-md sm:max-w-xl m-5 flex flex-col overflow-y-scroll no-scrollbar p-5">
        <button className="z-20 flex justify-end w-full cursor-default">
          <X
            size={32}
            className="p-2 text-white rounded-full cursor-pointer bg-dark-blue"
            onClick={onClose}
          />
        </button>
        <h2 className="mb-4 text-xl font-medium text-center text-white">
          My Parties
        </h2>
        {parties.length > 0 ? (
          <ul className="flex flex-col items-center flex-grow space-y-2 overflow-y-auto">
            {parties.map((group) => (
              <li key={group.id}>
                <PartyCard group={group} onClick={handleGroupClick} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-white">
            You have not created any parties yet.
          </p>
        )}
        <div className="mt-4">
          <CreateBtn
            onClick={handleCreateClick}
            loading={createLoading}
            text={"Create New Party"}
          />
        </div>
      </div>
    </div>
  );
};

export default PartySwitcher;
