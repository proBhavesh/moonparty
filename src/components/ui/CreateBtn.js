import Link from "next/link";

const Button = ({ link, text }) => {
	return (
		<Link
			href={link}
			className="p-6 px-20 md:px-32 bg-primary-pink hover:bg-primary-pink/90 duration-300 rounded-3xl justify-center items-center gap-3.5 inline-flex"
		>
			<div className="text-xl text-center text-white">{text}</div>
		</Link>
	);
};

export default Button;
