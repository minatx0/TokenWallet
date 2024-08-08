require('dotenv').config();
const Web3 = require('web3');
const { bytecode, abi } = require('./TokenContract.json'); // Ensure this path is correct
const web3 = new Web3(process.env.NODE_URL);
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const enhancedLog = (message, type = 'info') => {
    const currentTime = new Date().toUTCString();
    const prefix = `[${currentTime}] [${type.toUpperCase()}]:`;
    switch (type) {
        case 'error':
            console.error(prefix, message);
            break;
        case 'success':
            console.log(prefix, message);
            break;
        default:
            console.log(prefix, message);
            break;
    }
};

const deployTokenContract = async () => {
    const TokenContract = new web3.eth.Contract(abi);
    const deployOptions = {
        data: bytecode,
        arguments: [],
    };

    try {
        const estimatedGas = await TokenContract.deploy(deployOptions)
            .estimateGas({ from: account.address });
        const newContractInstance = await TokenContract.deploy(deployOptions)
            .send({
                from: account.address,
                gas: estimatedGas,
                gasPrice: '10000000000',
            });
        enhancedLog(`Token contract deployed at address: ${newContractInstance.options.address}`, 'success');
        await getContractBalance(newContractInstance.options.address);
    } catch (error) {
        enhancedLog('Failed to deploy the token contract: ' + error.message, 'error');
    }
};

const getContractBalance = async (contractAddress) => {
    try {
        const balance = await web3.eth.getBalance(contractAddress);
        enhancedLog(`Contract balance for ${contractAddress}: ${web3.utils.fromWei(balance, 'ether')} ETH`, 'info');
    } catch (error) {
        enhancedLog('Failed to get contract balance: ' + error.message, 'error');
    }
};

deployTokenContract().catch(error => enhancedLog(error.message, 'error'));