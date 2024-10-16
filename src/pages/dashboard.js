import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import CreateBtn from "@/components/ui/CreateBtn";
import PartyCard from "@/components/ui/PartyCard";

export default function Dashboard() {
	const router = useRouter();
	const { isAuthenticated, publicKey, checkAndSetAuthState } =
		useWalletConnection();
	const [groups, setGroups] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const initDashboard = async () => {
			const authState = await checkAndSetAuthState();
			if (authState.isAuthenticated && authState.publicKey) {
				fetchUserGroups(authState.publicKey);
			} else {
				setLoading(false);
			}
		};

		initDashboard();
	}, [checkAndSetAuthState]);

	const fetchUserGroups = async (walletPublicKey) => {
		try {
			const response = await fetch(`/api/dashboard/${walletPublicKey}`);
			const data = await response.json();
			setGroups(data);
		} catch (error) {
			console.error("Error fetching user groups:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div className="text-sm text-center text-white">Loading...</div>;
	}

	if (!isAuthenticated) {
		return (
			<div className="text-sm text-center text-white">
				Please connect your wallet to view the dashboard.
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-between text-white h-[90vh]">
			<div>
				<h1 className="mb-3 text-2xl text-center">My Parties</h1>
				{groups.length > 0 ? (
					<ul className="flex flex-col items-center space-y-2 overflow-scroll h-1/2 md:h-3/4">
						{groups.map((group) => (
							<li key={group.id}>
								<PartyCard group={group} />
							</li>
						))}
					</ul>
				) : (
					<p>You have not created any parties yet.</p>
				)}
			</div>

			<div>
				<CreateBtn link={"/create-group"} text={"Create New Party"} />
			</div>
		</div>
	);
}
