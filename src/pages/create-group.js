import { useState } from "react";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import { useRouter } from "next/router";

export default function CreateGroup() {
	const [groupName, setGroupName] = useState("");
	const [error, setError] = useState(null);
	const { isAuthenticated, publicKey } = useWalletConnection();
	const router = useRouter();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);

		if (!isAuthenticated) {
			setError("Please connect your wallet to create a group.");
			return;
		}

		try {
			const response = await fetch("/api/groups/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: groupName,
					creatorWallet: publicKey,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create group");
			}

			const data = await response.json();
			router.push(`/group/${data.id}`);
		} catch (error) {
			console.error("Error creating group:", error);
			setError("Failed to create group. Please try again.");
		}
	};

	if (!isAuthenticated) {
		return <div>Please connect your wallet to create a group.</div>;
	}

	return (
		<div>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col items-center mt-10 space-y-4"
			>
				<div>
					<input
						type="text"
						required
						name="groupName"
						value={groupName}
						placeholder="Party Name..."
						onChange={(e) => setGroupName(e.target.value)}
						className="w-screen max-w-md py-5 text-center text-white placeholder-purple-300 md:max-w-lg rounded-3xl bg-dark-blue"
					/>
				</div>

				{error && <p className="text-white text-md">{error}</p>}

				<div className="">
					<button
						type="submit"
						className="bg-primary-pink hover:bg-primary-pink/90 duration-300 rounded-3xl justify-center items-center gap-3.5 inline-flex w-screen max-w-md md:max-w-lg py-5"
					>
						<span className="text-center text-white text-md">
							Create New Party
						</span>
					</button>
				</div>
			</form>
		</div>
	);
}
