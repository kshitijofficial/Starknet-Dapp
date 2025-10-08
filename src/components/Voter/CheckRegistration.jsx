import { useState, useEffect } from "react";
import { Contract } from 'starknet';
import voteAbi from "../../abi/voteAbi.json"
import { CONTRACT_ADDRESS } from "../../constants/contractAddress";

const RegistrationChecker = ({ account }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [registrationStatus, setRegistrationStatus] = useState(null);
    const [hasChecked, setHasChecked] = useState(false);

    const checkVoterRegistrationStatus = async () => {
        if (!account) {
            setErrorMessage("Please connect your wallet first");
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        try {
            const contract = new Contract(voteAbi.abi, CONTRACT_ADDRESS, account);
            const result = await contract.is_voter_registered(account.address);
            setRegistrationStatus(result);
            setHasChecked(true);
            console.log("Registration status:", result);
        } catch (error) {
            console.error("Error checking registration:", error);
            setErrorMessage("Failed to check registration status. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-check when account is connected
    useEffect(() => {
        if (account && !hasChecked) {
            checkVoterRegistrationStatus();
        }
    }, [account]);

    return (
        <div className="voting-card">
            <div className="card-header">
                <div className="card-icon">✓</div>
                <h3 className="card-title">Registration Status</h3>
            </div>
            <p className="card-description">
                Check if your wallet address is registered for voting
            </p>

            {registrationStatus !== null && (
                <div className={`status-display ${registrationStatus ? 'status-success' : 'status-warning'
                    }`}>
                    {registrationStatus ?
                        '✅ You are registered to vote' :
                        '⚠️ You are not registered to vote'
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
                onClick={checkVoterRegistrationStatus}
                disabled={isLoading || !account}
            >
                {isLoading ? 'Checking...' : 'Check Registration Status'}
            </button>
        </div>
    );
};

export default RegistrationChecker;