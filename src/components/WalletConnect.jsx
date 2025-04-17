// import { connect } from '@starknet-io/get-starknet'; // v4.0.3 min
// import { WalletAccount, wallet, Contract } from 'starknet'; // v6.18.0 min

// import abi from "../abi/abi.json"
// const WalletConnect = () => {
//     const myFrontendProviderUrl = 'https://free-rpc.nethermind.io/sepolia-juno/v0_7';
//     // standard UI to select a wallet:
//     async function connectWallet() {
//         try {
//             const selectedWalletSWO = await connect({ modalMode: 'alwaysAsk', modalTheme: 'dark' });
//             const myWalletAccount = await WalletAccount.connect(
//                 { nodeUrl: myFrontendProviderUrl },
//                 selectedWalletSWO
//             );

//             const contractAddress = "0x0672ba3b6f931cf9d87c46cdf208143b119d02386502ed66214532e6f2782579"
//             const counterContract = new Contract(abi.abi, contractAddress, myWalletAccount);
//             console.log("Counter Contract:", counterContract)

//             const counter = await counterContract.get_counter();
//             console.log("counter:", counter)

//         } catch (err) {
//             console.error("Wallet connection failed:", err);
//         }
//     }

//     return (
//         <button onClick={connectWallet}>Connect</button>
//     )
// }
// export default WalletConnect;


// // const writeChainId = await wallet.requestChainId(myWalletAccount.walletProvider);
// // const readChainId = await myWalletAccount.getChainId();
// // // const bl = await myWalletAccount.getBlockNumber();
// // console.log(bl)
// // console.log("myWalletAccount:", myWalletAccount);
// // console.log("writeChainId:", writeChainId);
// // console.log("readChainId:", readChainId);
// //const contractAddress = 0x0672ba3b6f931cf9d87c46cdf208143b119d02386502ed66214532e6f2782579
// // const lendContract = new Contract(abi.abi, contractAddress, myWalletAccount);
// // const qty = await lendContract.get_available_asset(addr); // use of the WalletAccount provider
// // const resp = await lendContract.process_lend_asset(addr); // use of the browser wallet