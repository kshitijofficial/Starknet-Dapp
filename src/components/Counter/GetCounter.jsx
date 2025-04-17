import { useState } from "react";
import { Contract } from 'starknet'; // v6.18.0 min
import counterAbi from "../../abi/counterAbi.json"
import { CONTRACT_ADDRESS } from "../../constants/contractAddress";
const GetCounter = ({ account }) => {
    const [counter, setCounter] = useState(0)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGetCounter = async () => {
        setLoading(true);
        setError(null);
        try {
            const contract = new Contract(counterAbi.abi, CONTRACT_ADDRESS, account);
            const result = await contract.get_counter();
            setCounter(result.toString());
        } catch (err) {
            console.error("Error fetching counter:", err);
            setError("Failed to fetch counter");
        } finally {
            setLoading(false);
        }
    };

    return (<>
        {loading ? <p className="counter-display">Loading...</p> : <p className="counter-display">Counter: {counter}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="button-group">
            <button onClick={handleGetCounter} disabled={!account || loading}>
                Get Counter
            </button>
        </div>

    </>)
}
export default GetCounter;