import Web3 from 'web3';
import contractABI from './contractABI.json'; 
require('dotenv').config();

const contractAddress = process.env.CONTRACT_ADDRESS; 
let currentUserAccount;
let cryptoTokenContract;
let web3Instance;

const initializeWallet = async () => {
    if (window.ethereum) { 
        try {
            web3Instance = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' }); 
            const accounts = await web3Instance.eth.getAccounts();
            currentUserAccount = accounts[0]; 
            cryptoTokenContract = new web3Instance.eth.Contract(contractABI, contractAddress); 
            refreshUI(); 
        } catch (error) {
            console.error("Error while accessing Ethereum accounts: ", error);
        }
    } else {
        console.error("Error: MetaMask extension is not detected.");
    }
};

const fetchTokenBalance = async () => {
    const tokenBalance = await cryptoTokenContract.methods.balanceOf(currentUserAccount).call();
    return tokenTokenBalance;
};

const refreshUI = async () => {
    try {
        const balance = await fetchTokenBalance();
        document.getElementById('tokenBalance').innerText = `Your Token Balance: ${balance}`;
    } catch (error) {
        console.error("Error encountered during UI update: ", error);
    }
};

window.ethereum.on('accountsChanged', async (accounts) => {
    currentUserAccount = accounts[0];
    refreshUI(); 
});

initializeWallet();