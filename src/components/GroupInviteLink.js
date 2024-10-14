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
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900">Invite Link</h3>
      <div className="mt-2 flex rounded-md shadow-sm">
        <input
          type="text"
          readOnly
          value={fullInviteLink}
          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md text-sm border-gray-300 focus:ring-purple-500 focus:border-purple-500"
        />
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default GroupInviteLink;
