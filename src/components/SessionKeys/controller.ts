import { Connector } from "@starknet-react/core";
import { ControllerConnector } from "@cartridge/connector";
import { ControllerOptions } from "@cartridge/controller";
import { CONTRACT_ADDRESS } from '../../constants/contractAddress';

// Define session policies for the voting contract
const policies = {
    contracts: {
        [CONTRACT_ADDRESS]: { 
            methods: [

                {
                    name: "vote", 
                    entrypoint: "vote"
                },
                {
                    name: "register_voter", 
                    entrypoint: "register_voter"
                }
            ]
        }
    }
};

const options: ControllerOptions = {
    policies,
    chains: [{ rpcUrl:"https://api.cartridge.gg/x/starknet/sepolia"}],
    defaultChainId: "0x534e5f5345504f4c4941",
   
};

const cartridgeConnector = new ControllerConnector(
  options,
) as never as Connector;
export default cartridgeConnector;
