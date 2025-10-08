import Controller from '@cartridge/controller';
import { CONTRACT_ADDRESS } from '../../constants/contractAddress';

// Define session policies for the voting contract
const policies = {
    contracts: {
        [CONTRACT_ADDRESS]: {
            name: "Vote Contract",
            description: "Allows voting and voter registration",
            methods: [

                {
                    name: "Cast Vote",
                    description: "Cast a vote for the proposal",
                    entrypoint: "vote"
                },
                {
                    name: "Register Voter",
                    description: "Register as a voter",
                    entrypoint: "register_voter"
                }
            ]
        }
    }
};

const controller = new Controller({
    policies,
    rpc: "https://starknet-sepolia.public.blastapi.io/rpc/v0_7",
    chainId: "SN_SEPOLIA",
    // Add redirect URL for proper Cartridge authentication flow
    redirectUrl: window.location.origin,
    // Optional: Add app name for better UX in Cartridge UI
    app: "VoteCairo"
});

export default controller;
