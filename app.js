import Web3 from 'web3';
import contractABI from './contractABI.json'; 
require('dotenv').config();

const contractAddress = process.env.CONTRACT_ADDRESS; 
let selectedAccount;
let tokenContract;
let web3;

const init = async () => {
    if (window.ethereum) { 
        try {
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' }); 
            const accounts = await web3.eth.getAccounts();
            selectedAccount = accounts[0]; 
            tokenContract = new web3.eth.Contract(contractABI, contractAddress); 
            updateUI(); 
        } catch (error) {
            console.error("Error accessing the Ethereum accounts", error);
        }
    } else {
        console.error("MetaMask is not installed");
    }
};

const getTokenBalance = async () => {
    const balance = await tokenContract.methods.balanceOf(selectedAccount).call();
    return balance;
};

const updateUI = async () => {
    try {
        const balance = await getTokenBalance();
        document.getElementById('tokenBalance').innerText = `Your Balance: ${balance}`;
    } catch (error) {
        console.error("Error updating the UI", error);
    }
};

window.ethereum.on('accountsChanged', async (accounts) => {
    selectedAccount = accounts[0];
    updateUI(); 
});

init();