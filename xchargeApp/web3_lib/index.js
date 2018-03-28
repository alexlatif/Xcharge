const Web3 = require('web3');
const xChargeContract = require('./Xcharge_web3');
const simpleChargeContract = require('./SimpleCharger_web3');
const sendTx = require('./web3_sendTx');
const read = require('./web3_call');

async function sendTxToKovan(from, privateKey, method, valueInFinney) {
  return await sendTx(
    from,
    accounts.contract.test_kovan_x_charge,
    method,
    valueInFinney,
    privateKey,
    new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545')
  );
}

async function callFromKovan(from, method, valueInFinney, decodeInto) {
  return await read(
    from,
    accounts.contract.test_kovan_simple_charger,
    method,
    valueInFinney,
    decodeInto,
    new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545')
  );
}

async function sendTxToRopsten(from, privateKey, method, valueInFinney) {
  return await sendTx(
    from,
    accounts.contract.test_kovan_x_charge,
    method,
    valueInFinney,
    privateKey,
    new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545')
  );
}

async function callFromRopsten(from, method, valueInFinney, decodeInto) {
  return await read(
    from,
    accounts.contract.test_kovan_simple_charger,
    method,
    valueInFinney,
    decodeInto,
    new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545')
  );
}

async function sendTxToRinkeby(from, privateKey, method, valueInFinney) {
  return await sendTx(
    from,
    accounts.contract.test_kovan_x_charge,
    method,
    valueInFinney,
    privateKey,
    new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545')
  );
}

async function callFromRinkeby(from, method, valueInFinney, decodeInto) {
  return await read(
    from,
    accounts.contract.test_kovan_simple_charger,
    method,
    valueInFinney,
    decodeInto,
    new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545')
  );
}

// xChargeContract functions

// txData
// txData = {
//  from: address,
//  valueInFinney: unit256 or null
// }
async function depositFunds(txData) {
  const method = xChargeContract.depositFunds();
  const fromPrivateKey = getPrivateKey(txData.from);

  return await sendTxToKovan(
    txData.from,
    fromPrivateKey,
    method,
    txData.valueInFinney
  );
}

// txData
// txData = {
//  from: address,
//  valueInFinney: unit256 or null
// }
async function reclaimFunds(txData) {
  const method = xChargeContract.reclaimFunds();
  const fromPrivateKey = getPrivateKey(txData.from);

  return await sendTxToKovan(
    txData.from,
    fromPrivateKey,
    method,
    txData.valueInFinney
  );
}

// txData, methodParam
// txData = {
//  from: address,
//  valueInFinney: unit256 or null
// }
// methodParam = {
//   user: address,
//   amount: unit256
// }
async function useFunds(txData, methodParam) {
  const method = xChargeContract.useFunds(methodParam.user, methodParam.amount);
  const fromPrivateKey = getPrivateKey(txData.from);

  return await sendTxToKovan(
    txData.from,
    fromPrivateKey,
    method,
    txData.valueInFinney
  );
}

// txData, methodParam
// txData = {
//  from: address,
//  valueInFinney: unit256 or null
// }
// methodParam = {
//   user: address
// }
async function refund(txData, methodParam) {
  const method = xChargeContract.refund(methodParam.user);
  const fromPrivateKey = getPrivateKey(txData.from);

  return await sendTxToKovan(
    txData.from,
    fromPrivateKey,
    method,
    txData.valueInFinney
  );
}

function getPrivateKey(from) {
  return accounts.user[from].private_key;
}

// view

async function kind(chain) {
  const method = simpleChargeContract.kind();
  const from = accounts.user.node.address;

  if (chain === 'ropsten') {
    return await callFromRopsten(from, method, null, 'uint8');
  } else {
    return await callFromRinkeby(from, method, null, 'uint8');
  }
}
// view
async function name(chain) {
  const method = simpleChargeContract.name();
  const from = accounts.user.node.address;

  if (chain === 'ropsten') {
    return await callFromRopsten(from, method, null, 'string');
  } else {
    return await callFromRinkeby(from, method, null, 'string');
  }
}
// view
async function rate(chain) {
  const method = simpleChargeContract.rate();
  const from = accounts.user.node.address;

  if (chain === 'ropsten') {
    return await callFromRopsten(from, method, null, 'uint256');
  } else {
    return await callFromRinkeby(from, method, null, 'uint256');
  }
}
// view
async function showBalance(chain) {
  const method = simpleChargeContract.showBalance();
  const from = accounts.user.node.address;

  if (chain === 'ropsten') {
    return await callFromRopsten(from, method, null, 'uint256');
  } else {
    return await callFromRinkeby(from, method, null, 'uint256');
  }
}
// view
async function showFundsOf(user, chain) {
  const method = simpleChargeContract.showFundsOf(user);
  const from = accounts.user.node.address;

  if (chain === 'ropsten') {
    return await callFromRopsten(from, method, null, 'uint256');
  } else {
    return await callFromRinkeby(from, method, null, 'uint256');
  }
}

async function startCharging(from, user, timestamp, chain) {
  return contract.methods.startCharging(user, timestamp).encodeABI();
}

async function stopCharging(user, amount, timestamp) {
  return contract.methods.stopCharging(user, amount, timestamp).encodeABI();
}

async function deposit(user) {
  return contract.methods.deposit(user).encodeABI();
}

async function reclaim(user) {
  return contract.methods.reclaim(user).encodeABI();
}

module.exports = {
  depositFunds: depositFunds,
  reclaimFunds: reclaimFunds,
  useFunds: useFunds,
  refund: refund
};
