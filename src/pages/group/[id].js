import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useWalletConnection } from "../../context/WalletConnectionProvider";
import LeaderboardTable from "../../components/LeaderboardTable";
import GroupInviteLink from "../../components/GroupInviteLink";
import AssetSnapshot from "../../components/AssetSnapshot";
import TopUsers from "@/components/TopUsers";
import UserCard from "@/components/ui/UserCard";

export default function GroupDetails() {
	const router = useRouter();
	const { id } = router.query;
	const [group, setGroup] = useState(null);
	const [loading, setLoading] = useState(true);
	const { isAuthenticated, publicKey } = useWalletConnection();

	useEffect(() => {
		if (id && isAuthenticated) {
			fetchGroupDetails();
		}
	}, [id, isAuthenticated]);

	const fetchGroupDetails = async () => {
		try {
			const response = await fetch(`/api/groups/${id}`);
			const data = await response.json();
			setGroup(data);
		} catch (error) {
			console.error("Error fetching group details:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!isAuthenticated) {
		return <div>Please connect your wallet to view group details.</div>;
	}

	if (!group) {
		return <div>Group not found.</div>;
	}

	return (
		<>
			<div>
				<TopUsers members={group.group_members} />
				{/* <LeaderboardTable groupId={id} /> */}
				{/* <AssetSnapshot groupId={id} onSnapshotTaken={fetchGroupDetails} /> */}

				{/* members */}
				<div className="flex flex-col items-center justify-center mt-10 space-y-2 overflow-x-auto">
					{group.group_members.map((member, index) => (
						<UserCard
							key={member.users.wallet_address}
							id={index + 1}
							name={member.users.username || "Anonymous"}
							count={0}
						/>
					))}
					{console.log(group.group_members)}
				</div>

				<GroupInviteLink inviteLink={group.invite_link} />
			</div>
		</>
	);
}
