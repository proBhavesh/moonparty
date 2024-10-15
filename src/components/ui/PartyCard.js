import { useState } from "react";
import Link from "next/link";
import { SquarePen } from "lucide-react";
import EditPartyModal from "../EditPartyModal";

function PartyCard({ group }) {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	return (
		<>
			<div className="text-white bg-dark-blue gap-3.5 p-3.5 rounded-3xl justify-between items-center flex hover:bg-primary-pink duration-300 md:max-w-lg w-screen max-w-md">
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
						<SquarePen />
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
