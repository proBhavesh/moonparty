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
			<div className="">
				<div className="min-h-screen m-10 bg-primary-blue">
					<Navbar />
					<main className="mx-auto">{children}</main>
				</div>
			</div>
		</>
	);
};

export default Layout;
