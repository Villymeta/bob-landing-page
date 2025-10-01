"use client";
import { WalletProvider, ConnectionProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo, createContext, useContext } from "react";

const ClusterContext = createContext("mainnet-beta");
export function useCluster() {
  return useContext(ClusterContext);
}

export default function Providers({ children }) {
  const endpoint =
    process.env.NEXT_PUBLIC_SOLANA_RPC || clusterApiUrl("mainnet-beta");

  const cluster = endpoint.includes("devnet") ? "devnet" : "mainnet-beta";

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: cluster }),
    ],
    [cluster]
  );

  return (
    <ClusterContext.Provider value={cluster}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ClusterContext.Provider>
  );
}