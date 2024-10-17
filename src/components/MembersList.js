import UserCard from "./ui/UserCard";

function MembersList({ members }) {
  return (
    <div className="flex flex-col items-center space-y-2 overflow-x-auto">
      {members.map((member, index) => (
        <li key={index} className="list-none cursor-pointer">
          <UserCard
            id={index + 1}
            name={member.users.username}
            count={member.daily_change_percentage || 0}
            avatar={member.users.avatar_url}
          />
        </li>
      ))}
    </div>
  );
}

export default MembersList;
