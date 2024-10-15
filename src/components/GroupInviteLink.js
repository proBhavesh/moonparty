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
		<div className="flex justify-between w-screen max-w-md md:max-w-lg border border-dashed border-white/60 rounded-3xl gap-3.5 p-4">
			<input
				type="text"
				readOnly
				value={fullInviteLink}
				className="flex w-full pl-2 truncate bg-transparent text-white/60 focus:outline-none"
			/>
			<button
				onClick={copyToClipboard}
				className="px-3 py-1.5 text-white rounded-full bg-primary-pink"
			>
				{copied ? "Copied!" : "Copy"}
			</button>
		</div>
	);
};

export default GroupInviteLink;
