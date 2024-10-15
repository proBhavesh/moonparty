import { useState, useEffect } from "react";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import Image from "next/image";
import { useRouter } from "next/router";
import { removeAuthCookie } from "../lib/authCookies";
import { X } from "lucide-react";
import MembersList from "./MembersList";

const UserProfile = ({ onClose }) => {
	const router = useRouter();
	const { user, logout } = useWalletConnection();
	const [leaderboards, setLeaderboards] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLeaderboards = async () => {
			if (!user?.wallet_address) return;

			try {
				const response = await fetch(
					`/api/user/leaderboards?walletAddress=${user.wallet_address}`
				);
				if (response.ok) {
					const data = await response.json();
					setLeaderboards(data);
				} else {
					console.error("Failed to fetch leaderboards");
				}
			} catch (error) {
				console.error("Error fetching leaderboards:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchLeaderboards();
	}, [user]);

	const handleGroupClick = (groupId) => {
		router.push(`/group/${groupId}`);
		onClose();
	};

	const handleLogout = () => {
		removeAuthCookie();
		logout();
		onClose();
		router.push("/");
	};

	if (!user) {
		return null; // Or some loading state
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="rounded-3xl h-[95vh] md:h-[60vh] bg-primary-blue w-full max-w-md sm:max-w-xl m-5 flex flex-col overflow-y-scroll no-scrollbar">
				<div className="flex-grow px-1 py-2 overflow-y-auto sm:p-5">
					<button
						onClick={onClose}
						className="flex justify-end w-full"
					>
						<X
							size={32}
							className="p-2 text-white rounded-full bg-dark-blue"
						/>
					</button>

					{/* profile pic, username & wallet address */}
					<div className="flex flex-col items-center gap-2 mb-4 -mt-5">
						<Image
							src="/sample-img.png"
							alt="User Avatar"
							width={64}
							height={64}
							className="rounded-full"
						/>
						<div className="text-center">
							<p className="text-xl text-white">
								{user.username || "Anonymous"}
							</p>
						</div>
					</div>

					{/* leaderboards */}
					{loading ? (
						<p className="text-center text-white">
							Loading leaderboards...
						</p>
					) : leaderboards.length > 0 ? (
						<MembersList
							members={leaderboards}
							handleGroupClick={handleGroupClick}
						/>
					) : (
						<p className="text-center text-white">
							You are not part of any leaderboards yet!
						</p>
					)}
				</div>

				{/* logout button */}
				<div className="p-5">
					<button
						onClick={handleLogout}
						className="w-full py-3 text-white transition-colors duration-200 rounded-2xl bg-primary-pink hover:bg-primary-pink/90"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
