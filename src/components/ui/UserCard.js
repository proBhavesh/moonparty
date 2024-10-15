import Image from "next/image";

function UserCard({ id, src, name, count }) {
	return (
		<div className="text-white bg-dark-blue p-3.5 rounded-3xl justify-between items-center flex w-[90%] md:w-[60%] lg:w-[50%]">
			<div className="flex items-center gap-3.5">
				<span className="w-5 text-xl text-center text-white/60">
					{id}
				</span>
				<Image
					width={40}
					height={40}
					alt="User Avatar"
					src={src || "/sample-img.png"}
					className="w-12 h-12 rounded-full"
				/>
				<p className="text-xl">{name}</p>
			</div>

			<div className="px-3.5 py-2 bg-primary-blue rounded-full justify-start items-center gap-3.5 flex">
				<span>+{count}%</span>
			</div>
		</div>
	);
}

export default UserCard;
