import Image from "next/image";

function UserCard({ id, avatar, name, count }) {
  const isPositive = count >= 0;
  const formattedCount = Math.abs(count).toFixed(2);

  return (
    <div className="flex items-center justify-between w-screen max-w-xs p-4 text-white bg-dark-blue rounded-3xl sm:max-w-lg">
      <div className="flex items-center gap-3.5">
        <span className="text-xl text-center text-white/60">{id}</span>
        <Image
          width={40}
          height={40}
          alt="User Avatar"
          src={avatar || "/sample-img.png"}
          className="w-12 h-12 rounded-full"
        />
        <p className="text-xl">{name}</p>
      </div>

      <div
        className={`px-3.5 py-2 ${
          isPositive ? "bg-primary-blue" : "bg-red-500"
        } rounded-full justify-start items-center gap-3.5 flex`}
      >
        <span>
          {isPositive ? "+" : "-"} {formattedCount}%
        </span>
      </div>
    </div>
  );
}

export default UserCard;
