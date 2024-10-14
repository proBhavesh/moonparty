import { useEffect, useLayoutEffect, useState } from "react";
import { useWalletConnection } from "../context/WalletConnectionProvider";
import UserCard from "@/components/ui/UserCard";
import CreateBtn from "@/components/ui/CreateBtn";

export default function Dashboard() {
	const { isAuthenticated, publicKey } = useWalletConnection();
	const [groups, setGroups] = useState([]);

	useEffect(() => {
		if (isAuthenticated && publicKey) {
			fetchUserGroups();
		}
	}, [isAuthenticated, publicKey]);

	const fetchUserGroups = async () => {
		try {
			const response = await fetch(`/api/dashboard/${publicKey}`);
			const data = await response.json();
			setGroups(data);
		} catch (error) {
			console.error("Error fetching user groups:", error);
		}
	};

	if (!isAuthenticated) {
		return <div>Please connect your wallet to view the dashboard.</div>;
	}

	return (
		<div className="flex flex-col items-center text-white">
			{/* <UserCard
				sno={1}
				name={"Elijah"}
				src={"/sample-img.png"}
				count={26.53}
			/> */}
			{groups.length}
			{groups.length > 0 ? (
				<ul>
					{groups.map((group) => {
						<li key={group.id}>
							<UserCard id={group.id} />
						</li>;
					})}
				</ul>
			) : (
				<p>You have not joined any groups yet.</p>
			)}

			<div className="mt-5">
				<CreateBtn link={"/create-group"} text={"Create New Party"} />
			</div>
			{/* <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
			<h2 className="mb-4 text-2xl font-semibold">Your Groups</h2>
			{groups.length > 0 ? (
				<ul className="space-y-4">
					{groups.map((group) => (
						<li
							key={group.id}
							className="overflow-hidden bg-white shadow sm:rounded-md"
						>
							<Link
								href={`/group/${group.id}`}
								className="block hover:bg-gray-50"
							>
								<div className="px-4 py-4 sm:px-6">
									<div className="flex items-center justify-between">
										<p className="text-sm font-medium text-purple-600 truncate">
											{group.name}
										</p>
										<div className="flex flex-shrink-0 ml-2">
											<p className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
												{group.members_count} members
											</p>
										</div>
									</div>
								</div>
							</Link>
						</li>
					))}
				</ul>
			) : (
				<p>You havent joined any groups yet.</p>
			)}
			<div className="mt-6">
				<Link
					href="/create-group"
					className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
				>
					Create New Group
				</Link>
			</div> */}
		</div>
	);
}
