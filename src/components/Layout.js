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
      <div className="min-h-screen bg-gray-100">
        {/* <Navbar /> */}
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </>
  );
};

export default Layout;
