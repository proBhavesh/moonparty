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
		<div className="flex justify-between w-screen max-w-xs sm:max-w-lg border-2 border-dashed border-white/50 rounded-3xl p-3.5">
			<input
				type="text"
				readOnly
				value={fullInviteLink}
				className="flex pl-2 truncate bg-transparent w-80 text-white/60 focus:outline-none"
			/>
			<button
				onClick={copyToClipboard}
				className="px-3.5 py-2 text-white rounded-full bg-primary-pink"
			>
				{copied ? "Copied!" : "Copy"}
			</button>
		</div>
	);
};

export default GroupInviteLink;
