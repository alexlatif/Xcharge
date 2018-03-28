

// deploys to local parity node to be able to test functions

const Web3 = require('web3');
const abi = require('./abi');
const byte = require('./Xcharge_web3/byte')

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

const contract = new web3.eth.Contract(abi.abi);

const newContractAddress;

contract.deploy({
    data: byte
})
.send({
    from: '0x1234567890123456789012345678901234567891',
    gas: 1500000,
    gasPrice: '30000000000000'
}, (error, transactionHash) => {
    if(error) {
        console.log(error)
    } else {
        console.log(transactionHash)
    }
})
.on('receipt', function (receipt) {
    newContractAddress = receipt.contractAddress;
    console.log('contract address', receipt.contractAddress); // contains the new contract address
})

// node deployContractTest.js