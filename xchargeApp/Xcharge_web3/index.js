const Web3 = require('web3');
const abi = require('./abi');

const web3 = new Web3();

const contract = new web3.eth.Contract(abi.abi);

function depositFunds() {
  return contract.methods.depositFunds().encodeABI();
}

function reclaimFunds() {
  return contract.methods.reclaimFunds().encodeABI();
}

function useFunds(user, amount) {
  return contract.methods.useFunds(user, amount).encodeABI();
}

function refund(user) {
  return contract.methods.refund(user).encodeABI();
}

module.exports = {
  depositFunds: depositFunds,
  reclaimFunds: reclaimFunds,
  useFunds: useFunds,
  refund: refund
};
