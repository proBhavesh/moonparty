import UserCard from "./ui/UserCard";

function MembersList({ members, handleGroupClick }) {
	return (
		<div className="flex flex-col items-center space-y-2 overflow-x-auto">
			{members.map((member, index) => (
				<li
					key={index}
					onClick={() => handleGroupClick(member.id)}
					className="list-none cursor-pointer"
				>
					<UserCard
						id={index + 1}
						name={member.name || member.users.username}
						count={member.daily_change_percentage || 0}
					/>
				</li>
			))}
		</div>
	);
}

export default MembersList;
