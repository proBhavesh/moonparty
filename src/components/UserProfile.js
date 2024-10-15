import { useState, useEffect } from "react";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import Image from "next/image";
import { useRouter } from "next/router";
import { removeAuthCookie } from "../lib/authCookies";
import { X } from "lucide-react";

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
			<div className="rounded-lg h-[80vh] bg-primary-blue w-full md:w-2/3 lg:w-1/3 m-10 overflow-y-auto p-4">
				<button onClick={onClose} className="flex justify-end w-full">
					<X className="text-white" />
				</button>

				<div className="flex flex-col items-center gap-2 mb-4">
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
						<p className="text-sm text-white/60">
							{user.wallet_address}
						</p>
					</div>
				</div>

				{loading ? (
					<p className="text-center text-white">
						Loading leaderboards...
					</p>
				) : leaderboards.length > 0 ? (
					<ul className="space-y-2">
						{leaderboards.map((board) => (
							<li
								key={board.id}
								className="p-3 transition-colors duration-200 bg-purple-700 rounded cursor-pointer hover:bg-purple-600"
								onClick={() => handleGroupClick(board.id)}
							>
								<p className="text-lg font-semibold text-white">
									{board.name}
								</p>
								<p className="text-sm text-gray-300">
									Rank: {board.rank}
								</p>
								<p className="text-sm text-gray-300">
									Daily Change:{" "}
									{board.daily_change_percentage.toFixed(2)}%
								</p>
							</li>
						))}
					</ul>
				) : (
					<p className="text-center text-white">
						You are not part of any leaderboards yet!
					</p>
				)}

				<div className="flex justify-center w-full">
					<button
						onClick={handleLogout}
						className="w-3/4 py-3 mt-4 text-white transition-colors duration-200 rounded-2xl bg-primary-pink hover:bg-primary-pink/90"
					>
						Logout
					</button>
				</div>
			</div>
		</div>
		// <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		// 	<div className="bg-purple-800 rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
		// 		<div className="flex items-center justify-between mb-4">
		// 			<h2 className="text-2xl font-bold text-white">
		// 				User Profile
		// 			</h2>
		// 			<button onClick={onClose} className="text-white">
		// 				&times;
		// 			</button>
		// 		</div>
		// 		<div className="flex items-center mb-4">
		// 			<Image
		// 				src="/sample-img.png"
		// 				alt="User Avatar"
		// 				width={64}
		// 				height={64}
		// 				className="mr-4 rounded-full"
		// 			/>
		// 			<div>
		// 				<p className="text-xl font-semibold text-white">
		// 					{user.username || "Anonymous"}
		// 				</p>
		// 				<p className="text-sm text-gray-300">
		// 					{user.wallet_address}
		// 				</p>
		// 			</div>
		// 		</div>
		// 		<button
		// 			onClick={handleLogout}
		// 			className="w-full px-4 py-2 mb-4 text-white transition-colors duration-200 bg-red-500 rounded hover:bg-red-600"
		// 		>
		// 			Logout
		// 		</button>
		// 		<h3 className="mb-2 text-xl font-semibold text-white">
		// 			Your Leaderboards
		// 		</h3>
		// 		{loading ? (
		// 			<p className="text-white">Loading leaderboards...</p>
		// 		) : leaderboards.length > 0 ? (
		// 			<ul className="space-y-2">
		// 				{leaderboards.map((board) => (
		// 					<li
		// 						key={board.id}
		// 						className="p-3 transition-colors duration-200 bg-purple-700 rounded cursor-pointer hover:bg-purple-600"
		// 						onClick={() => handleGroupClick(board.id)}
		// 					>
		// 						<p className="text-lg font-semibold text-white">
		// 							{board.name}
		// 						</p>
		// 						<p className="text-sm text-gray-300">
		// 							Rank: {board.rank}
		// 						</p>
		// 						<p className="text-sm text-gray-300">
		// 							Daily Change:{" "}
		// 							{board.daily_change_percentage.toFixed(2)}%
		// 						</p>
		// 					</li>
		// 				))}
		// 			</ul>
		// 		) : (
		// 			<p className="text-white">
		// 				You are not part of any leaderboards yet.
		// 			</p>
		// 		)}
		// 	</div>
		// </div>
	);
};

export default UserProfile;
