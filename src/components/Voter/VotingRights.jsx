import { useState, useEffect } from "react";
import { Contract } from 'starknet';
import voteAbi from "../../abi/voteAbi.json"
import { CONTRACT_ADDRESS } from "../../constants/contractAddress";

const VotingRightsChecker = ({ account }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [votingRights, setVotingRights] = useState(null);
    const [hasChecked, setHasChecked] = useState(false);

    const checkVotingRights = async () => {
        if (!account) {
            setErrorMessage("Please connect your wallet first");
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        try {
            const contract = new Contract(voteAbi.abi, CONTRACT_ADDRESS, account);
            const result = await contract.voter_can_vote(account.address);
            setVotingRights(result);
            setHasChecked(true);
            console.log("Voting rights:", result);
        } catch (error) {
            console.error("Error checking voting rights:", error);
            setErrorMessage("Failed to check voting rights. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-check when account is connected
    useEffect(() => {
        if (account && !hasChecked) {
            checkVotingRights();
        }
    }, [account]);

    return (
        <div className="voting-card">
            <div className="card-header">
                <div className="card-icon">🗿</div>
                <h3 className="card-title">Voting Rights</h3>
            </div>
            <p className="card-description">
                Verify if you have the right to cast a vote
            </p>

            {votingRights !== null && (
                <div className={`status-display ${votingRights ? 'status-success' : 'status-error'
                    }`}>
                    {votingRights ?
                        '✅ You can vote' :
                        '❌ You cannot vote at this time'
                    }
                </div>
            )}

            {errorMessage && (
                <div className="status-display status-error">
                    {errorMessage}
                </div>
            )}

            <button
                className={`btn ${isLoading ? 'btn-loading' : 'btn-secondary'}`}
                onClick={checkVotingRights}
                disabled={isLoading || !account}
            >
                {isLoading ? 'Checking...' : 'Check Voting Rights'}
            </button>
        </div>
    );
};

export default VotingRightsChecker;