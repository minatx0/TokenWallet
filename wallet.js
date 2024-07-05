const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
let wallets = {};
let transactions = [];
function createWallet() {
  const id = crypto.randomBytes(16).toString('hex');
  const privateKey = crypto.randomBytes(32).toString('hex');
  const wallet = { id, privateKey };
  wallets[id] = wallet;
  return { id, privateKey };
}
function storePrivateKey(id, privateKey) {
  process.env[`PRIVATE_KEY_${id}`] = privateKey;
}
function getPrivateKey(id) {
  return process.env[`PRIVATE_KEY_${id}`];
}
function viewPrivateKey(id) {
  const privateKey = getPrivateKey(id);
  if (!privateKey) {
    throw new Error('Wallet not found or access denied');
  }
  return privateKey;
}
function addTransaction(senderId, receiverId, amount) {
  const transaction = { senderId, receiverId, amount, timestamp: new Date().toISOString() };
  transactions.push(transaction);
  return transaction;
}
function viewTransactions(walletId) {
  const walletTransactions = transactions.filter(transaction => transaction.senderId === walletId || transaction.receiverId === walletId);
  return walletTransactions;
}
module.exports = {
  createWallet,
  storePrivateKey,
  viewPrivateKey,
  addTransaction,
  viewTransactions,
};