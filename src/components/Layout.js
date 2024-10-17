import Head from "next/head";
import Navbar from "./Navbar";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

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
      <div className="w-screen h-screen p-1 diamond-gradient">
        <div className="w-full h-full bg-primary-blue">
          {!isHomePage && <Navbar />}
          <main className="w-full h-full mx-auto">{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;
