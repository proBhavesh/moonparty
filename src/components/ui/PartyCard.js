import Link from "next/link";
import { SquarePen } from "lucide-react";

function PartyCard({ group }) {
    return (
        <div className="text-white bg-dark-blue gap-3.5 p-3.5 rounded-3xl justify-between items-center flex hover:bg-primary-pink duration-300">
            <Link href={`/group/${group.id}`}>
                <div className="flex flex-col justify-center">
                    <span className="text-xl">{group.name}</span>
                    <span className="text-white/50 text-base">{group.members_count} members</span>
                </div>
            </Link>
            <div>
                <button className="bg-primary-blue rounded-full p-2">
                    <SquarePen />
                </button>
            </div>
        </div>
    );
}

export default PartyCard;