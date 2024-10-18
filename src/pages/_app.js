import "../styles/globals.css";
import { SolanaProvider } from "../lib/solanaUtils";
import { WalletConnectionProvider } from "../context/WalletConnectionProvider";
import { PartyProvider } from "../context/PartyContext";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <SolanaProvider>
      <WalletConnectionProvider>
        <PartyProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PartyProvider>
      </WalletConnectionProvider>
    </SolanaProvider>
  );
}

export default MyApp;
