function TopUsers({ members }) {
	const usernames = ["user1", "user2", "user3"];
	const percentages = [26.5, 82.3, 5.6];

	return (
		<>
			<div className="flex items-baseline justify-center gap-5">
				<div className="flex flex-col items-center">
					<div className="relative">
						<div className="flex items-center justify-center w-20 h-20 border-2 rounded-full bg-dark-blue border-[#0099ff]">
							<div className="absolute flex items-center justify-center w-5 h-5 px-3 py-3 rounded-full bg-[#0099ff] -left-2 top-2">
								<span className="text-base text-white">2</span>
							</div>
						</div>
					</div>
					<div className="mt-2 text-lg font-bold text-white">
						{usernames[2]}
					</div>
					<div className="px-3.5 py-2 mt-2 text-base font-bold text-white bg-[#0099ff] rounded-3xl">
						+ {percentages[2]}%
					</div>
				</div>

				<div className="flex flex-col items-center">
					<div className="relative">
						<div className="flex items-center justify-center border-2 rounded-full w-28 h-28 bg-dark-blue border-[#ffb600]">
							<div className="absolute flex items-center justify-center w-8 h-8 px-3 py-3 bg-[#ffb600] rounded-full -left-2 top-2">
								<span className="text-base text-white">1</span>
							</div>
						</div>
					</div>
					<div className="mt-2 text-lg font-bold text-white">
						{usernames[0]}
					</div>
					<div className="px-3.5 py-2 mt-2 text-base font-bold text-white bg-[#ffb600] rounded-3xl">
						+ {percentages[0]}%
					</div>
				</div>

				<div className="flex flex-col items-center">
					<div className="relative">
						<div className="flex items-center justify-center w-20 h-20 border-2 rounded-full bg-dark-blue border-[#ff00fa]">
							<div className="absolute flex items-center justify-center w-5 h-5 px-3 py-3 rounded-full bg-[#ff00fa] -left-2 top-2">
								<span className="text-base text-white">3</span>
							</div>
						</div>
					</div>
					<div className="mt-2 text-lg font-bold text-white">
						{usernames[2]}
					</div>
					<div className="px-3.5 py-2 mt-2 text-base font-bold text-white bg-[#ff00fa] rounded-3xl">
						+ {percentages[2]}%
					</div>
				</div>
			</div>
		</>
	);
}

export default TopUsers;
