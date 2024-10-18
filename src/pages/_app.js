import "../styles/globals.css";
import { SolanaProvider } from "../lib/solanaUtils";
import { WalletConnectionProvider } from "../context/WalletConnectionProvider";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <SolanaProvider>
      <WalletConnectionProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WalletConnectionProvider>
    </SolanaProvider>
  );
}

export default MyApp;
