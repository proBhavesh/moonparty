import Head from "next/head";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
	return (
		<>
			<Head>
				<title>Solana Wallet Leaderboard</title>
				<meta
					name="description"
					content="Track your Solana wallet performance with friends"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="w-screen h-screen p-2 diamond-gradient">
				<div className="w-full h-full bg-primary-blue">
					<Navbar />
					<main className="mx-auto">{children}</main>
				</div>
			</div>
		</>
	);
};

export default Layout;
