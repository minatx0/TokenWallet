const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

let walletRegistry = {};
let ledger = [];

function generateWallet() {
  const walletId = crypto.randomBytes(16).toString('hex');
  const walletPrivateKey = crypto.randomBytes(32).toString('hex');
  const encryptedPrivateKey = encryptPrivateKey(walletPrivateKey);
  const walletDetails = { id: walletId, privateKey: encryptedPrivateKey };
  walletRegistry[walletId] = walletDetails;
  savePrivateKey(walletId, encryptedPrivateKey); // Save encrypted private key
  return { id: walletId, privateKey: walletPrivateKey }; // Return plaintext private key for user
}

function encryptPrivateKey(privateKey) {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.SECRET_KEY);
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptPrivateKey(encryptedPrivateKey) {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.SECRET_KEY);
  let decrypted = decipher.update(encryptedPrivateKey, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function savePrivateKey(walletId, encryptedPrivateKey) {
  process.env[`WALLET_PRIVATE_KEY_${walletId}`] = encryptedPrivateKey;
}

function retrievePrivateKey(walletId) {
  const encryptedPrivateKey = process.env[`WALLET_PRIVATE_KEY_${walletId}`];
  return decryptPrivateKey(encryptedPrivateKey); // Decrypt the private key before returning it
}

function displayPrivateKey(walletId) {
  const walletPrivateKey = retrievePrivateKey(walletId);
  if (!walletPrivateKey) {
    throw new Error('Wallet not found or access denied');
  }
  return walletPrivateKey;
}

function recordTransaction(senderWalletId, receiverWalletId, transferAmount) {
  if (!verifyTransaction(senderWalletId, transferAmount)) {
    throw new Error('Insufficient funds for transaction');
  }
  const newTransaction = {
    senderId: senderWalletId,
    receiverId: receiverWalletId,
    amount: transferAmount,
    timestamp: new Date().toISOString()
  };
  ledger.push(newTransaction);
  return newForecastTransaction;
}

function listTransactions(walletId) {
  const relatedTransactions = ledger.filter(transaction => transaction.senderId === walletId || transaction.receiverId === walletId);
  return relatedTransactions;
}

function verifyTransaction(senderWalletId, transferAmount) {
  const balance = getWalletBalance(senderWalletId);
  return balance >= transferAmount;
}

function getWalletBalance(walletId) {
  let balance = 0;
  ledger.forEach(transaction => {
    if (transaction.receiverId === walletId) {
      balance += transaction.amount;
    } else if (transaction.senderId === walletId) {
      balance -= transaction.amount;
    }
  });
  return balance;
}

module.exports = {
  generateWallet,
  savePrivateKey,
  displayPrivateKey,
  recordTransaction,
  listTransactions,
  verifyTransaction, // Export the new verifyTransaction function
  getWalletBalance, // Export the getWalletBalance function for possible external you
};