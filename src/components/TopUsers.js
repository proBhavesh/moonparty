function TopUsers({ members }) {
	const usernames = ["user1", "user2", "user3"];

	return (
		<>
			<div className="flex items-baseline justify-center gap-5">
				<div className="flex flex-col items-center">
					<div className="relative">
						<div className="flex items-center justify-center w-20 h-20 rounded-full bg-dark-blue">
							<div className="absolute flex items-center justify-center w-5 h-5 px-3 py-3 bg-blue-500 rounded-full -left-2 top-2">
								<span className="text-base text-white">2</span>
							</div>
						</div>
					</div>
					<div className="px-4 py-1 mt-2 text-base text-white rounded-3xl bg-dark-blue">
						{usernames[1]}
					</div>
				</div>
				<div className="flex flex-col items-center">
					<div className="relative">
						<div className="flex items-center justify-center rounded-full w-28 h-28 bg-dark-blue">
							<div className="absolute flex items-center justify-center w-8 h-8 px-3 py-3 bg-yellow-500 rounded-full -left-2 top-2">
								<span className="text-base text-white">1</span>
							</div>
						</div>
					</div>
					<div className="px-4 py-1 mt-2 text-base text-white rounded-3xl bg-dark-blue">
						{usernames[0]}
					</div>
				</div>
				<div className="flex flex-col items-center">
					<div className="relative">
						<div className="flex items-center justify-center w-20 h-20 rounded-full bg-dark-blue">
							<div className="absolute flex items-center justify-center w-5 h-5 px-3 py-3 bg-pink-500 rounded-full -left-2 top-2">
								<span className="text-base text-white">3</span>
							</div>
						</div>
					</div>
					<div className="px-4 py-1 mt-2 text-base text-white rounded-3xl bg-dark-blue">
						{usernames[2]}
					</div>
				</div>
			</div>
		</>
	);
}

export default TopUsers;
