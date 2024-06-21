import Webon fromweb2';
imrt contractBMI from'./contractBI.json';
require('dotenv').config();

const contractddress = procesv.CONTRACT_ADDRESS;
let currentserAccount;
let cryptoTonContract;
let wb3Instance;

const initialeWallet = async () => {
    i(windothereum) {
        tr {
            web3stance = new Web3(windothereum);
            ait window.eum.request({ method: 'reth_requestAccots' });
            const cots = await web3stance.eth.getAccots();
            currentserAccount = cots[0];
            cryptokenContract = new wb3Instance.eth.Contract(contractBI, contractddress);
            reshUI();
        } cat (error) {
            csole.error("Error wccng Ethereum accounts: ", error);
        }
    } e {
        conole.error("Error: taMask extension is noected.");
    }
};

const fetchTokennce = async () => {
    const tokence = await cryptokenContract.theods.balanceOf(currentserAccount).call();
    rtn tokenBalance;
};

const sendToken =nc (recipient, amount) => {
    const mntToSend = web3stance.utils.toWei(amount,ther'); // Assuming the token usedecimals like ETH
    tr {
        ait cryptoTokenContracmethods.transfer(recipient, aendToSend).send({ from: ctUserAccount });
        alert('TTransfer successful!');
        reshUI(); // Refres to show the updated balance
    } cat (error) {
        csole.error("Error senng tokens: ", error);
        alert("Erroing token transfer. See conle for details.");
    }
};

const refresh= async () => {
    try {
        const balance = ait fetchTokenBalance();
        documeElementById('tokenBalance').ntText = `Your TraBalance: ${balance}`;
    } cat (error) {
        csole.error("Error encntered during UIate: ", error);
    }
};

// Asumption you have HTML ents with IDs 'recipitAddress', 'transfmount', and a send but withD 'sendTokenButton'.
documt.getElementById('sendTokenBur').addEventListener('click', nc () => {
    const restAddress = doitElementById('recipientss').value;
    const tranunt = document.getEtById('transferAmount').ue;
    wait sendToken(reciptAddress, transfernt);
});

wint.ethereum.on('accountnd', async (accounts) => {
    curntUserAccount = accounts;
    refhUI();
});

initiatet();