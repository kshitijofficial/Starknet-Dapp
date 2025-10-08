import { useState, useRef } from "react";
import { Contract } from 'starknet';
import voteAbi from "../../abi/voteAbi.json"
import { CONTRACT_ADDRESS } from "../../constants/contractAddress";

const VoterRegistration = ({ account }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const voterAddressRef = useRef(null);

    const handleVoterRegistration = async (e) => {
        e.preventDefault();

        if (!account) {
            setErrorMessage("Please connect your wallet first");
            return;
        }

        const voterAddress = voterAddressRef.current.value.trim();
        if (!voterAddress) {
            setErrorMessage("Please enter a valid voter address");
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const contract = new Contract(voteAbi.abi, CONTRACT_ADDRESS, account);
            const result = await contract.register_voter(voterAddress);
            console.log("Registration result:", result);
            setSuccessMessage(`Voter ${voterAddress} has been successfully registered!`);
            voterAddressRef.current.value = '';
        } catch (error) {
            console.error("Error registering voter:", error);
            setErrorMessage("Failed to register voter. Please check the address and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="voting-card">
            <div className="card-header">
                <div className="card-icon">📝</div>
                <h3 className="card-title">Register Voter</h3>
            </div>
            <p className="card-description">
                Register a new voter by providing their wallet address
            </p>

            <form onSubmit={handleVoterRegistration}>
                <div className="form-group">
                    <label className="form-label" htmlFor="voterAddress">
                        Voter Address
                    </label>
                    <input
                        id="voterAddress"
                        ref={voterAddressRef}
                        type="text"
                        className="form-input"
                        placeholder="0x..."
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className={`btn ${isLoading ? 'btn-loading' : 'btn-primary'}`}
                    disabled={isLoading || !account}
                >
                    {isLoading ? 'Registering...' : 'Register Voter'}
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

export default VoterRegistration;
