import UserCard from "./ui/UserCard";

function LeaderboardList({ members, handleGroupClick }) {
  return (
    <div className="flex flex-col items-center space-y-2 overflow-x-auto">
      {members.map((leaderboard, index) => (
        <li
          key={leaderboard.id}
          onClick={() => handleGroupClick(leaderboard)}
          className="list-none cursor-pointer"
        >
          <UserCard
            id={index + 1}
            name={leaderboard.name}
            count={leaderboard.daily_change_percentage || 0}
          />
        </li>
      ))}
    </div>
  );
}

export default LeaderboardList;
