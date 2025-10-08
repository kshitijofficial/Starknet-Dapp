import React, { useState } from 'react';
import controller from './controller';
import { CONTRACT_ADDRESS } from '../../constants/contractAddress';

const SessionKeysManager = ({ player, setPlayer }) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [isVoting, setIsVoting] = useState(false);
    const [message, setMessage] = useState('');

    const connectPlayer = async () => {
        setIsConnecting(true);
        setMessage('');
        try {
            // Connect with session policies - this will show the policy approval screen
            const account = await controller.connect();
            console.log(account)
            setPlayer(account);
            setMessage('Successfully connected! Session policies approved.');
        } catch (error) {
            console.error('Connection failed:', error);
            setMessage('Failed to connect: ' + error.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const castVoteWithSession = async (voteChoice) => {
        if (!player) {
            setMessage('Please connect first');
            return;
        }

        setIsVoting(true);
        setMessage('');
        try {
            // Execute vote transaction using session (no manual approval needed)
            const result = await player.execute([
                {
                    contractAddress: CONTRACT_ADDRESS,
                    entrypoint: "vote",
                    calldata: [voteChoice], // 0 for No, 1 for Yes
                }
            ]);

            console.log('Vote transaction result:', result);
            const voteText = voteChoice === 1 ? 'Yes' : 'No';
            setMessage(`Vote "${voteText}" cast successfully! TX: ${result.transaction_hash}`);
        } catch (error) {
            console.error('Vote failed:', error);
            setMessage('Vote failed: ' + error.message);
        } finally {
            setIsVoting(false);
        }
    };

    const registerVoterWithSession = async () => {
        if (!player) {
            setMessage('Please connect first');
            return;
        }

        setIsVoting(true);
        setMessage('');
        try {
            // Execute voter registration using session
            const result = await player.execute([
                {
                    contractAddress: CONTRACT_ADDRESS,
                    entrypoint: "register_voter",
                    calldata: [player.address], // Register the connected account
                }
            ]);

            console.log('Registration result:', result);
            setMessage(`Voter registration successful! TX: ${result.transaction_hash}`);
        } catch (error) {
            console.error('Registration failed:', error);
            setMessage('Registration failed: ' + error.message);
        } finally {
            setIsVoting(false);
        }
    };

    return (
        <div className="session-manager">
            <div className="card-header">
                <div className="card-icon">🔑</div>
                <h3 className="card-title">Session Keys Manager</h3>
            </div>
            <p className="card-description">
                Connect with session policies to enable gasless transactions
            </p>

            {!player ? (
                <button
                    onClick={connectPlayer}
                    className={`btn ${isConnecting ? 'btn-loading' : 'btn-primary'}`}
                    disabled={isConnecting}
                >
                    {isConnecting ? 'Connecting...' : 'Connect with Session'}
                </button>
            ) : (
                <div>
                    <p className="status-display status-success">
                        Connected: {player.address}
                    </p>

                    <div className="button-group">
                        <button
                            onClick={registerVoterWithSession}
                            className={`btn ${isVoting ? 'btn-loading' : 'btn-secondary'}`}
                            disabled={isVoting}
                        >
                            {isVoting ? 'Processing...' : 'Register Voter (Session)'}
                        </button>

                        <button
                            onClick={() => castVoteWithSession(1)}
                            className={`btn ${isVoting ? 'btn-loading' : 'btn-primary'}`}
                            disabled={isVoting}
                        >
                            {isVoting ? 'Processing...' : 'Vote Yes (Session)'}
                        </button>

                        <button
                            onClick={() => castVoteWithSession(0)}
                            className={`btn ${isVoting ? 'btn-loading' : 'btn-danger'}`}
                            disabled={isVoting}
                        >
                            {isVoting ? 'Processing...' : 'Vote No (Session)'}
                        </button>
                    </div>
                </div>
            )}

            {message && (
                <div className={`status-display ${message.includes('Success') || message.includes('successful') ? 'status-success' : 'status-error'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default SessionKeysManager;
