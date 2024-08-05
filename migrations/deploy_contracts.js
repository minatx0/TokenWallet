require('dotenv').config();
const Web3 = require('web3');
const { bytecode, abi } = require('./TokenContract.json');
const web3 = new Web3(process.env.NODE_URL);
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);
const deployTokenContract = async () => {
    const TokenContract = new web3.eth.Contract(abi);
    const deployOptions = {
        data: bytecode,
        arguments: [],
    };
    const estimatedGas = await TokenContract.deploy(deployOptions).estimateGas({from: account.address});
    TokenContract.deploy(deployOptions)
        .send({
            from: account.address,
            gas: estimatedGas,
            gasPrice: '10000000000' 
        })
        .then(newContractInstance => {
            console.log(`Token contract deployed at address: ${newContractInstance.options.address}`);
        })
        .catch(err => {
            console.error('Failed to deploy the token contract:', err);
        });
};
deployTokenContract().catch(console.error);