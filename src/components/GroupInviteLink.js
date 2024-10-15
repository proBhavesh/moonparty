import { useState } from "react";
import { generateInviteLink } from "../lib/utils";

const GroupInviteLink = ({ inviteLink }) => {
	const [copied, setCopied] = useState(false);
	const fullInviteLink = generateInviteLink(inviteLink);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(fullInviteLink);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="flex gap-2 p-2 mx-auto mt-5 border border-dashed border-white/60 rounded-2xl w-fit">
			<input
				type="text"
				readOnly
				value={fullInviteLink}
				className={`flex bg-transparent text-white/60 w-60 md:w-96 truncate focus:outline-none`}
			/>
			<button
				onClick={copyToClipboard}
				className="px-3 py-1 text-white rounded-full bg-primary-pink"
			>
				{copied ? "Copied!" : "Copy"}
			</button>
		</div>
	);
};

export default GroupInviteLink;
