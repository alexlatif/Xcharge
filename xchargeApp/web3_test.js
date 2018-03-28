const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const xChargeContract = require('./Xcharge_web3');
const simpleChargeContract = require('./SimpleCharger_web3');
const accounts = require('./accounts');
const sendTx = require('./web3_sendTx');
const read = require('./web3_call');

async function testXCharge() {
  const method = xChargeContract.depositFunds();
  const valueInFinney = 4;
  return await sendTx(
    accounts.user.test.address,
    accounts.contract.test_kovan_x_charge,
    method,
    valueInFinney,
    accounts.user.test.private_key,
    new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545')
  );
}

async function testSimpleCharge() {
  const method = simpleChargeContract.startCharging(
    accounts.user.test.address,
    Date.now()
  );
  return await sendTx(
    accounts.user.test.address,
    accounts.contract.test_kovan_simple_charger,
    method,
    null,
    accounts.user.test.private_key,
    new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545')
  );
}

async function testSimpleChargeCall() {
  const method = simpleChargeContract.showFundsOf(accounts.user.test.address);
  return await read(
    accounts.user.test.address,
    accounts.contract.test_kovan_simple_charger,
    method,
    null,
    'uint256',
    new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545')
  );
}

// function for kovan, ropsten, rinkeby

testXCharge().then(function() {
  console.log(':)');
});

testSimpleChargeCall().then(function(result) {
  console.log(':)', result);
});
