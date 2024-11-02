import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContextProvider = ({children}) => {
    const endpoint = clusterApiUrl("devnet");
  return (
    <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={[]}>
            <WalletModalProvider>
            {children}
            </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletContextProvider