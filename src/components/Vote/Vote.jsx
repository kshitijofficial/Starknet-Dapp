import { useState, useRef } from "react";
import { Contract } from 'starknet';
import voteAbi from "../../abi/voteAbi.json"
import { CONTRACT_ADDRESS } from "../../constants/contractAddress";

const VotingPanel = ({ account }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const voteChoiceRef = useRef(null);

    const handleVoteSubmission = async (e) => {
        e.preventDefault();

        if (!account) {
            setErrorMessage("Please connect your wallet first");
            return;
        }

        const voteChoice = voteChoiceRef.current.value;
        if (!voteChoice || voteChoice === "") {
            setErrorMessage("Please select your vote choice");
            return;
        }

        const numericChoice = parseInt(voteChoice, 10);
        if (isNaN(numericChoice) || (numericChoice !== 0 && numericChoice !== 1)) {
            setErrorMessage("Please select a valid vote option (0 for No, 1 for Yes)");
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const contract = new Contract(voteAbi.abi, CONTRACT_ADDRESS, account);
            console.log("🗳️ Attempting to vote:", {
                choice: numericChoice,
                voter: account.address,
                contractAddress: CONTRACT_ADDRESS
            });

            const result = await contract.vote(numericChoice);
            console.log("✅ Vote transaction result:", result);

            // Wait for transaction to be processed
            if (result.transaction_hash) {
                console.log("⏳ Waiting for transaction confirmation:", result.transaction_hash);
            }

            const voteText = numericChoice === 1 ? 'Yes' : 'No';
            setSuccessMessage(`Your vote for "${voteText}" has been successfully submitted! Transaction: ${result.transaction_hash || 'N/A'}`);
            voteChoiceRef.current.value = '';
        } catch (error) {
            console.error("❌ Error submitting vote:", error);

            // Enhanced error handling
            let errorMsg = "Failed to submit vote. ";
            if (error.message) {
                if (error.message.includes('USER_ALREADY_VOTED')) {
                    errorMsg = "❌ You have already voted! Each user can only vote once.";
                } else if (error.message.includes('Voter not registered')) {
                    errorMsg = "❌ You are not registered to vote. Please register first.";
                } else if (error.message.includes('Invalid vote choice')) {
                    errorMsg = "❌ Invalid vote choice. Please select Yes or No.";
                } else {
                    errorMsg += error.message;
                }
            }

            setErrorMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="voting-card">
            <div className="card-header">
                <div className="card-icon">🗳️</div>
                <h3 className="card-title">Cast Your Vote</h3>
            </div>
            <p className="card-description">
                Cast your vote: choose Yes (1) or No (0) for the proposal
            </p>

            <form onSubmit={handleVoteSubmission}>
                <div className="form-group">
                    <label className="form-label" htmlFor="voteChoice">
                        Your Vote Choice
                    </label>
                    <select
                        id="voteChoice"
                        ref={voteChoiceRef}
                        className="form-input"
                        disabled={isLoading}
                        defaultValue=""
                    >
                        <option value="" disabled>Select your vote...</option>
                        <option value="1">✅ Yes</option>
                        <option value="0">❌ No</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className={`btn ${isLoading ? 'btn-loading' : 'btn-primary'}`}
                    disabled={isLoading || !account}
                >
                    {isLoading ? 'Submitting...' : 'Submit Vote'}
                </button>
            </form>

            {successMessage && (
                <div className="status-display status-success">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="status-display status-error">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default VotingPanel;
