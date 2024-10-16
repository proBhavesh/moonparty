import React from "react";

function TopUsers({ members }) {
  // Check if members is an array and has elements
  if (!Array.isArray(members) || members.length === 0) {
    return <div className="text-white text-center">No members to display</div>;
  }

  // Sort members by daily_change_percentage in descending order
  const sortedMembers = [...members].sort(
    (a, b) => b.daily_change_percentage - a.daily_change_percentage
  );

  // Get top 3 members or all if less than 3
  const topThree = sortedMembers.slice(0, 3);

  // Define colors and sizes for each position
  const positions = [
    { color: "#ffb600", size: "w-28 h-28", numberSize: "w-8 h-8" },
    { color: "#0099ff", size: "w-20 h-20", numberSize: "w-5 h-5" },
    { color: "#ff00fa", size: "w-20 h-20", numberSize: "w-5 h-5" },
  ];

  // Function to render each user
  const renderUser = (user, index) => {
    const position = positions[index];
    return (
      <div key={user.user_id} className="flex flex-col items-center">
        <div className="relative">
          <div
            className={`flex items-center justify-center border-2 rounded-full ${position.size} bg-dark-blue`}
            style={{ borderColor: position.color }}
          >
            <div
              className={`absolute flex items-center justify-center ${position.numberSize} px-3 py-3 rounded-full -left-2 top-2`}
              style={{ backgroundColor: position.color }}
            >
              <span className="text-base text-white">{index + 1}</span>
            </div>
          </div>
        </div>
        <div className="mt-2 text-lg font-bold text-white">
          {user.users?.username || "Unknown User"}
        </div>
        <div
          className="px-3.5 py-2 mt-2 text-base font-bold text-white rounded-3xl"
          style={{ backgroundColor: position.color }}
        >
          {user.daily_change_percentage >= 0 ? "+" : "-"}{" "}
          {Math.abs(user.daily_change_percentage).toFixed(2)}%
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-baseline justify-center gap-5">
      {topThree.map((user, index) => renderUser(user, index))}
    </div>
  );
}

export default TopUsers;
