const Web3 = require('web3');
const xChargeContract = require('./Xcharge_web3');
const simpleChargeContract = require('./SimpleCharger_web3');
const sendTx = require('./web3_sendTx');
const read = require('./web3_call');
const accounts = require('./accounts');

const isTest = true;

let kovanProvider = null;
let kovanContract = null;
let ropstenProvider = null;
let ropstenContract = null;
let rinkebyProvider = null;
let rinkebyContract = null;
let nodeSender = null;

if (isTest) {
  kovanProvider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545');
  kovanContract = accounts.contract.test_kovan_x_charge;

  ropstenProvider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545');
  ropstenContract = accounts.contract.test_kovan_simple_charger;

  rinkebyProvider = new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545');
  rinkebyContract = accounts.contract.test_kovan_simple_charger;

  nodeSender = accounts.user.test.address;
} else {
  kovanProvider = new Web3.providers.HttpProvider(
    'https://kovan.infura.io/DCU9J2Po6i6WwVourC8M'
  );
  kovanContract = accounts.contract.kovan;

  ropstenProvider = new Web3.providers.HttpProvider(
    'https://ropsten.infura.io/DCU9J2Po6i6WwVourC8M'
  );
  ropstenContract = accounts.contract.ropsten;

  rinkebyProvider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/DCU9J2Po6i6WwVourC8M'
  );
  rinkebyContract = accounts.contract.rinkeby;

  nodeSender = accounts.user.node.address;
}

async function sendTxToKovan(from, privateKey, method, valueInFinney) {
  return await sendTx(
    from,
    kovanContract,
    method,
    valueInFinney,
    privateKey,
    kovanProvider
  );
}

async function callFromKovan(from, method, valueInFinney, decodeInto) {
  return await read(
    from,
    kovanContract,
    method,
    valueInFinney,
    decodeInto,
    kovanProvider
  );
}

async function sendTxToRopsten(from, privateKey, method, valueInFinney) {
  return await sendTx(
    from,
    ropstenContract,
    method,
    valueInFinney,
    privateKey,
    ropstenProvider
  );
}

async function callFromRopsten(from, method, valueInFinney, decodeInto) {
  return await read(
    from,
    ropstenContract,
    method,
    valueInFinney,
    decodeInto,
    ropstenProvider
  );
}

async function sendTxToRinkeby(from, privateKey, method, valueInFinney) {
  return await sendTx(
    from,
    rinkebyContract,
    method,
    valueInFinney,
    privateKey,
    rinkebyProvider
  );
}

async function callFromRinkeby(from, method, valueInFinney, decodeInto) {
  return await read(
    from,
    rinkebyContract,
    method,
    valueInFinney,
    decodeInto,
    rinkebyProvider
  );
}

function getPrivateKey(from) {
  const name = accounts.addressToName[from];
  return accounts.user[name].private_key;
}

//  sender: address,
//  valueInFinney: unit256
async function depositFunds(sender, valueInFinney) {
  const method = xChargeContract.depositFunds();
  const fromPrivateKey = getPrivateKey(sender);

  return await sendTxToKovan(sender, fromPrivateKey, method, valueInFinney);
}

//  sender: address
async function reclaimFunds(sender) {
  const method = xChargeContract.reclaimFunds();
  const fromPrivateKey = getPrivateKey(sender);

  return await sendTxToKovan(sender, fromPrivateKey, method, null);
}

//  user: address
//  amount: unit256
async function useFunds(user, amount) {
  const method = xChargeContract.useFunds(user, amount);
  const sender = nodeSender;
  const fromPrivateKey = getPrivateKey(sender);

  return await sendTxToKovan(sender, fromPrivateKey, method, null);
}

//  sender: address,
//  valueInFinney: unit256
//  user: address
async function refund(sender, valueInFinney, user) {
  const method = xChargeContract.refund(user);
  const fromPrivateKey = getPrivateKey(sender);

  return await sendTxToKovan(sender, fromPrivateKey, method, valueInFinney);
}

// view
// chain: ropsten | rinkeby
async function kind(chain) {
  const method = simpleChargeContract.kind();
  const sender = nodeSender;

  let energyType = null;
  if (chain === 'ropsten') {
    energyType = await callFromRopsten(sender, method, null, 'uint8');
  } else {
    energyType = await callFromRinkeby(sender, method, null, 'uint8');
  }

  if (energyType == 0) {
    energyType = 'Fossil';
  } else if (energyType == 1) {
    energyType = 'Nuclear';
  } else {
    energyType = 'Green';
  }

  return energyType;
}
// view
// chain: ropsten | rinkeby
async function name(chain) {
  const method = simpleChargeContract.name();
  const sender = nodeSender;

  if (chain === 'ropsten') {
    return await callFromRopsten(sender, method, null, 'string');
  } else {
    return await callFromRinkeby(sender, method, null, 'string');
  }
}
// view
// chain: ropsten | rinkeby
async function rate(chain) {
  const method = simpleChargeContract.rate();
  const sender = nodeSender;

  if (chain === 'ropsten') {
    return await callFromRopsten(sender, method, null, 'uint256');
  } else {
    return await callFromRinkeby(sender, method, null, 'uint256');
  }
}
// view
// chain: ropsten | rinkeby
async function showBalance(chain) {
  const method = simpleChargeContract.showBalance();
  const sender = nodeSender;

  if (chain === 'ropsten') {
    return await callFromRopsten(sender, method, null, 'uint256');
  } else {
    return await callFromRinkeby(sender, method, null, 'uint256');
  }
}
// view
// user: address
// chain: ropsten | rinkeby
async function showFundsOf(user, chain) {
  const method = simpleChargeContract.showFundsOf(user);
  const sender = nodeSender;

  if (chain === 'ropsten') {
    return await callFromRopsten(sender, method, null, 'uint256');
  } else {
    return await callFromRinkeby(sender, method, null, 'uint256');
  }
}

// sender: address
// user: address
// timestamp: unit256
// chain: ropsten | rinkeby
async function startCharging(sender, user, timestamp, chain) {
  const method = simpleChargeContract.startCharging(user, timestamp);
  const privateKey = getPrivateKey(sender);

  if (chain === 'ropsten') {
    return await sendTxToRopsten(sender, privateKey, method, null);
  } else {
    return await sendTxToRinkeby(sender, privateKey, method, null);
  }
}

// sender: address
// user: address
// timestamp: unit256
// chain: ropsten | rinkeby
async function stopCharging(sender, user, amount, timestamp, chain) {
  const method = simpleChargeContract.stopCharging(user, amount, timestamp);
  const privateKey = getPrivateKey(sender);

  if (chain === 'ropsten') {
    return await sendTxToRopsten(sender, privateKey, method, null);
  } else {
    return await sendTxToRinkeby(sender, privateKey, method, null);
  }
}

// sender: address
// user: address
// valueInFinney: unit256
// chain: ropsten | rinkeby
async function deposit(sender, valueInFinney, user, chain) {
  const method = simpleChargeContract.deposit(user);
  const privateKey = getPrivateKey(sender);

  if (chain === 'ropsten') {
    return await sendTxToRopsten(sender, privateKey, method, valueInFinney);
  } else {
    return await sendTxToRinkeby(sender, privateKey, method, valueInFinney);
  }
}

// user: address
// chain: ropsten | rinkeby
async function reclaim(user, chain) {
  const method = simpleChargeContract.reclaim(user);
  const sender = nodeSender;
  const privateKey = getPrivateKey(sender);

  if (chain === 'ropsten') {
    return await sendTxToRopsten(sender, privateKey, method, null);
  } else {
    return await sendTxToRinkeby(sender, privateKey, method, null);
  }
}

module.exports = {
  user: accounts.user,
  depositFunds: depositFunds,
  reclaimFunds: reclaimFunds,
  useFunds: useFunds,
  refund: refund,
  deposit: deposit,
  reclaim: reclaim,
  stopCharging: stopCharging,
  startCharging: startCharging,
  showFundsOf: showFundsOf,
  showBalance: showBalance,
  rate: rate,
  name: name,
  kind: kind
};
