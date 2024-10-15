import Link from "next/link";

const Button = ({ link, text }) => {
	return (
		<Link
			href={link}
			className="bg-primary-pink hover:bg-primary-pink/90 duration-300 rounded-3xl justify-center items-center gap-3.5 inline-flex w-screen max-w-md md:max-w-lg py-5"
		>
			<div className="text-center text-white text-md">{text}</div>
		</Link>
	);
};

export default Button;
