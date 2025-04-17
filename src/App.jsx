import { connect } from '@starknet-io/get-starknet'; // v4.0.3 min
import { WalletAccount } from 'starknet'; // v6.18.0 min
import { useState } from "react"
import GetCounter from "./components/Counter/GetCounter"
import SetCounter from "./components/Counter/SetCounter"
import './App.css'

function App() {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const myFrontendProviderUrl = 'https://free-rpc.nethermind.io/sepolia-juno/v0_7';
  // standard UI to select a wallet:
  const handleConnectWallet = async () => {
    try {
      const selected = await connect({ modalMode: 'alwaysAsk', modalTheme: 'dark' });
      const account = await WalletAccount.connect(
        { nodeUrl: myFrontendProviderUrl },
        selected
      );
      setIsConnected(true)
      setAccount(account);
    } catch (err) {
      console.error("Failed to connect wallet", err);
      alert("Could not connect to wallet. Check console.");
    }
  };


  return (
    <div className="app-container">
      <h1 className="heading">Cairo Counter Contract</h1>
      <SetCounter account={account} />
      <GetCounter account={account} />
      <div className="button-group">
        {isConnected ? (
          <button disabled style={{ cursor: "default", opacity: 0.6 }}>
            ✅ Connected
          </button>
        ) : (<button onClick={handleConnectWallet}>Connect</button>)}
      </div>
    </div>

  )
}

export default App
