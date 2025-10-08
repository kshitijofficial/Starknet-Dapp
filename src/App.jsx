import { connect } from '@starknet-io/get-starknet';
import { WalletAccount } from 'starknet';
import { useState } from "react"
import RegistrationChecker from "./components/Voter/CheckRegistration"
import './App.css'
import VotingStatus from './components/Vote/VoteStatus';
import VotingRightsChecker from './components/Voter/VotingRights';
import VoterRegistration from './components/Voter/RegisterVoter';
import VotingPanel from './components/Vote/Vote';
import SessionKeysManager from './components/SessionKeys/SessionKeysManager';

function StarkVoteApp() {
  const [walletAccount, setWalletAccount] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [player, setPlayer] = useState(null);
  const STARKNET_NODE_URL = "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/6mRl0GGte48YLAvo45S4n";

  // const STARKNET_NODE_URL = "http://127.0.0.1:5050";
  const connectWallet = async () => {
    try {
      const selectedWallet = await connect({ modalMode: 'alwaysAsk', modalTheme: 'dark' });
      const connectedAccount = await WalletAccount.connect(
        { nodeUrl: STARKNET_NODE_URL },
        selectedWallet
      );

      setIsWalletConnected(true)
      setWalletAccount(connectedAccount);
    } catch (error) {
      console.error("Failed to connect wallet", error);
      alert("Could not connect to wallet. Please check console for details.");
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">StarkVote</h1>
        <p className="app-subtitle">Decentralized Voting Platform</p>
      </header>

      <div className="wallet-connection">
        {isWalletConnected ? (
          <div className="connection-status">
            <div className="status-indicator"></div>
            Wallet Connected
          </div>
        ) : (
          <button className="btn btn-primary" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>

      <div className="voting-dashboard">
        <RegistrationChecker account={walletAccount} />
        <VotingStatus account={walletAccount} />
        <VotingRightsChecker account={walletAccount} />
        <VoterRegistration account={walletAccount} />
        <VotingPanel account={walletAccount} />
        <SessionKeysManager player={player} setPlayer={setPlayer} />
      </div>
    </div>
  )
}

export default StarkVoteApp
