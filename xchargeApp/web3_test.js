const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const xchargeC = require('./Xcharge_web3');
const accounts = require('./accounts');
const sendTx = require('./web3_sendTx');

async function test() {
  const method = xchargeC.depositFunds();

  return await sendTx(
    accounts.user.test.address,
    accounts.contract.test_kovan,
    method,
    4,
    accounts.user.test.private_key,
    new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545')
  );
}

test().then(function() {
  console.log(':)');
});
