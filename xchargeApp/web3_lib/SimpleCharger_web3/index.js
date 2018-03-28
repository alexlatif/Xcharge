const Web3 = require('web3');
const abi = require('./abi');

const web3 = new Web3();

const contract = new web3.eth.Contract(abi.abi);

// view
function kind() {
  return contract.methods.kind().encodeABI();
}
// view
function name() {
  return contract.methods.name().encodeABI();
}
// view
function rate() {
  return contract.methods.rate().encodeABI();
}

function startCharging(user, timestamp) {
  return contract.methods.startCharging(user, timestamp).encodeABI();
}

function showFundsOf(user) {
  return contract.methods.showFundsOf(user).encodeABI();
}

function showBalance() {
  return contract.methods.showBalance().encodeABI();
}

function stopCharging(user, amount, timestamp) {
  return contract.methods.stopCharging(user, amount, timestamp).encodeABI();
}

function deposit(user) {
  return contract.methods.deposit(user).encodeABI();
}

function reclaim(user) {
  return contract.methods.reclaim(user).encodeABI();
}

module.exports = {
  kind: kind,
  name: name,
  rate: rate,
  startCharging: startCharging,
  showFundsOf: showFundsOf,
  showBalance: showBalance,
  stopCharging: stopCharging,
  deposit: deposit,
  reclaim: reclaim
};
