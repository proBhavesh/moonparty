import Image from "next/image";

function UserCard({ id, src, name, count }) {
	return (
		<div className="flex items-center justify-between w-screen max-w-md p-4 text-white bg-dark-blue rounded-3xl md:max-w-lg">
			<div className="flex items-center gap-3.5">
				<span className="text-xl text-center text-white/60">{id}</span>
				<Image
					width={40}
					height={40}
					alt="User Avatar"
					src={src || "/sample-img.png"}
					className="w-12 h-12 rounded-full"
				/>
				<p className="text-xl">{name}</p>
			</div>

			<div className="px-3 py-1.5 bg-primary-blue rounded-full justify-start items-center gap-3.5 flex">
				<span>+ {count}%</span>
			</div>
		</div>
	);
}

export default UserCard;
