import Link from "next/link";

const Button = ({ link, text }) => {
	return (
		<Link
			href={link}
			className="inline-flex items-center justify-center w-screen max-w-xs py-6 duration-300 bg-primary-pink hover:bg-primary-pink/90 rounded-3xl sm:max-w-lg"
		>
			<div className="text-center text-white text-md">{text}</div>
		</Link>
	);
};

export default Button;
