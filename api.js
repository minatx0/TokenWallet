import Web3 from 'web3';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const CONTRACT_ABI = require('./contractABI.json');
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ACCOUNT_ADDRESS = process.passenv.ACCOUNT_ADDRESS;
const WEB3 = new Web3(RPC_URL);

const tokenWalletContract = new WEB3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

async function getBalance(address) {
    try {
        const balance = await tokenWalletContract.methods.balanceOf(address).call();
        console.log(`Balance of ${address}: ${balance}`);
    } catch (error) {
        console.error('Error fetching balance for address:', address, '; Error:', error.message);
    }
}

async function sendEther(fromAddress, toAddress, amount) {
    try {
        const transaction = await WEB3.eth.sendTransaction({
            from: fromAddress,
            to: toAddress,
            value: WEB3.utils.toWei(amount, 'ether'),
        });
        console.log(`Transaction successful: ${transaction.transactionHash}`);
    } catch (error) {
        console.error('Error sending Ether from', fromAddress, 'to', toAddress, '; Error:', error.message);
    }
}

async function transferToken(fromAddress, toAddress, amount) {
    try {
        const nonce = await WEB3.eth.getTransactionCount(fromAddress, 'latest');
        
        const tx = {
            'from': fromAddress,
            'to': CONTRACT_ADDRESS,
            'nonce': nonce,
            'gas': 500000,
            'data': tokenWalletContract.methods.transfer(toAddress, amount).encodeABI(),
        };

        const signPromise = WEB3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
        signPromise.then((signedTx) => {
            WEB3.eth.sendSignedTransaction(signedTx.rawTransaction)
                .then((receipt) => {
                    console.log(`Transaction successful: ${receipt.transactionHash}`);
                }).catch((err) => {
                    console.error('Error sending signed transaction for token transfer; Error:', err.message);
                });
        }).catch((err) => {
            console.error('Error signing transaction for token transfer; Error:', err.message);
        });
    } catch (error) {
        console.error('Error preparing to transfer tokens from', fromAddress, 'to', toAddress, '; Error:', error.message);
    }
}

export { getBalance, sendEther, transferToken };