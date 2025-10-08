import { useState, useEffect } from "react";
import { Contract } from 'starknet';
import voteAbi from "../../abi/voteAbi.json"
import { CONTRACT_ADDRESS } from "../../constants/contractAddress";

const VotingStatus = ({ account }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [voteStatus, setVoteStatus] = useState(null);
    const [hasChecked, setHasChecked] = useState(false);

    const fetchVoteStatus = async () => {
        if (!account) {
            setErrorMessage("Please connect your wallet first");
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        try {
            const contract = new Contract(voteAbi.abi, CONTRACT_ADDRESS, account);
            console.log("📊 Fetching vote status from contract:", CONTRACT_ADDRESS);

            const result = await contract.get_vote_status();
            console.log("📊 Raw contract response:", result);
            console.log("📊 Response type:", typeof result, "Array?", Array.isArray(result));

            // The contract returns (yes_votes, no_votes, total_votes, total_voters)
            // Convert BigInt values to numbers for display
            let voteCounts;
            if (Array.isArray(result)) {
                voteCounts = result.map(count => {
                    const num = Number(count);
                    console.log(`Converting ${count} (${typeof count}) to ${num}`);
                    return num;
                });
            } else if (typeof result === 'object' && result !== null) {
                // Handle case where result might be an object with numeric properties
                voteCounts = [
                    Number(result[0] || result['0'] || 0),
                    Number(result[1] || result['1'] || 0),
                    Number(result[2] || result['2'] || 0),
                    Number(result[3] || result['3'] || 0)
                ];
                console.log("📊 Converted object to array:", voteCounts);
            } else {
                voteCounts = [0, 0, 0, 0];
                console.warn("📊 Unexpected result format, using defaults:", result);
            }

            setVoteStatus(voteCounts);
            setHasChecked(true);
            console.log("📊 Final processed vote counts:", voteCounts);
        } catch (error) {
            console.error("❌ Error fetching vote status:", error);
            setErrorMessage(`Failed to fetch vote status: ${error.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-fetch when account is connected
    useEffect(() => {
        if (account && !hasChecked) {
            fetchVoteStatus();
        }
    }, [account]);

    return (
        <div className="voting-card">
            <div className="card-header">
                <div className="card-icon">📊</div>
                <h3 className="card-title">Voting Status</h3>
            </div>
            <p className="card-description">
                View the current status of the voting process
            </p>

            {voteStatus !== null && (
                <div className="status-display status-success">
                    <strong>Vote Results:</strong>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9em' }}>
                        <div>✅ Yes Votes: {voteStatus[0]}</div>
                        <div>❌ No Votes: {voteStatus[1]}</div>
                        <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
                            Total Votes Cast: {voteStatus[2]}
                        </div>
                        <div style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>
                            Total Registered Voters: {voteStatus[3]}
                        </div>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div className="status-display status-error">
                    {errorMessage}
                </div>
            )}

            <button
                className={`btn ${isLoading ? 'btn-loading' : 'btn-secondary'}`}
                onClick={fetchVoteStatus}
                disabled={isLoading || !account}
            >
                {isLoading ? 'Loading...' : 'Refresh Status'}
            </button>
        </div>
    );
};

export default VotingStatus;