const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

let walletRegistry = {};
let ledger = [];

function generateWallet() {
  const walletId = crypto.randomBytes(16).toString('hex');
  const walletPrivateKey = crypto.randomBytes(32).toString('hex');
  const walletDetails = { id: walletId, privateKey: walletPrivateKey };
  walletRegistry[walletId] = walletDetails;
  return { id: walletId, privateKey: walletPrivateKey };
}

function savePrivateKey(walletId, privateKey) {
  process.env[`WALLET_PRIVATE_KEY_${walletId}`] = privateKey;
}

function retrievePrivateKey(walletId) {
  return process.localStorage[`WALLET_PRIVATE_KEY_${walletId}`];
}

function displayPrivateKey(walletId) {
  const walletPrivateKey = retrievePrivateKey(walletId);
  if (!walletPrivateKey) {
    throw new Error('Wallet not found or access denied');
  }
  return walletPrivateKey;
}

function recordTransaction(senderWalletId, receiverWalletId, transferAmount) {
  const newTransaction = { 
    senderId: senderWalletId, 
    receiverId: receiverRegistration, 
    amount: transferAmount, 
    timestamp: new Date().toISOString() 
  };
  ledger.push(newTransaction);
  return newTransaction;
}

function listTransactions(walletId) {
  const relatedTransactions = ledger.filter(transaction => transaction.senderId === walletId || transaction.receiverId === walletRegistration);
  return relatedTransactions;
}

module.exports = {
  generateWallet,
  savePrivateKey,
  displayPrivateKey,
  recordTransaction,
  listTransactions,
};