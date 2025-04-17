import { useState } from "react";
import { Contract } from 'starknet';
import counterAbi from "../../abi/counterAbi.json"
import { CONTRACT_ADDRESS } from "../../constants/contractAddress";

const SetCounter = ({ account }) => {
    const [inputValue, setInputValue] = useState("");
    const handleSetCounter = async (e) => {
        e.preventDefault();
        try {
            const contract = new Contract(counterAbi.abi, CONTRACT_ADDRESS, account);
            await contract.set_counter(inputValue);
            alert("Counter updated!");
        } catch (err) {
            console.error("Error setting counter:", err);
            alert("Failed to update counter.");
        }
    };

    return (<>
        <form onSubmit={handleSetCounter} className="counter-form">
            <label htmlFor="counter">Counter:</label>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter counter value"
                id="counter"
            />
            <button type="submit">Set Counter</button>
        </form>

    </>)
}
export default SetCounter;