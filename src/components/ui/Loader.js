const LoadingAnimation = () => {
	return (
		<div className="flex items-center justify-center h-screen bg-primary-dark">
			<svg className="w-24 h-24 animate-spin" viewBox="0 0 100 100">
				<circle
					className="text-gray-300"
					strokeWidth="8"
					stroke="currentColor"
					fill="transparent"
					r="42"
					cx="50"
					cy="50"
				/>
				<circle
					className="text-yellow-400"
					strokeWidth="8"
					strokeDasharray="66 198"
					strokeDashoffset="198"
					strokeLinecap="round"
					stroke="currentColor"
					fill="transparent"
					r="42"
					cx="50"
					cy="50"
				>
					<animateTransform
						attributeName="transform"
						type="rotate"
						from="0 50 50"
						to="360 50 50"
						dur="1.5s"
						repeatCount="indefinite"
					/>
				</circle>
			</svg>
		</div>
	);
};

export default LoadingAnimation;
