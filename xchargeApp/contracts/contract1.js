
var contract_code;

var contract_hash = "0xB5345E95c67CF9FeCd19EC26B61E3fbD4504b85C"
var contract_abi = [{ "constant": true, "inputs": [], "name": "getCreator", "outputs": [{ "name": "", "type": "address", "value": "0xec5b0babf948af1ba8360b144159dd0618cc0dbf" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getNum", "outputs": [{ "name": "", "type": "uint256", "value": "3" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newNum", "type": "uint256" }], "name": "setNum", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }]

// ajax call to call solidity file instead of posting it here
// var client = new XMLHttpRequest();
// client.open('GET', './contract.sol');
// client.onreadystatechange = () => {
//     if (client.readyState == 4) {
//         contract_code = client.responseText;
//     }
// }
// client.send();

// setting web3 provider
// if (typeof web3 !== 'undefined') {
//     web3 = new Web3(web3.currentProvider);
// } else {
//     // set the provider you want from Web3.providers
//     web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
// }


var contract_instance;

function deployContract() {
    var compiled_contract = web3.eth.compile.solidity(contract_code);
    var code = compiled_contract['<stdin>:MyContract'].code;
    var abi = compiled_contract['<stdin>:MyContract'].info.abiDefinition;
    console.log(compiled_contract);
    web3.personal.unlockAccount(web3.eth.accounts[0], '123');

    web3.eth.contract(abi).new({
        data: code,
        from: web3.eth.accounts[0],
        gas: 3000000
    }, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            if (result.address) {
                contract_instance = res;
                console.log(contract_instance);
                makeButtonsVisible();
            }
        }
    })
}

function makeButtonsVisible() {
    var buttons = document.getElementsByClassName("buttonVisibleWithAvailableInstance");
    for (i = 0; i < buttons.length; i++) {
        buttons[i].style.visibility = 'visible';
    }
}

function getPreviouslyDeployedContract() {
    contract_instance = web3.eth.contract(contract_abi).at(contract_hash);
    makeButtonsVisible();
}

function getCounter() {
    document.getElementById("myNum").innerText = contract_instance.getNum().toNumber();
}

function increaseCounter() {
    var currNum = contract_instance.getNum().toNumber();
    currNum++;
    web3.personal.unlockAccount(web3.eth.accounts[0], '123')
    contract_instance.setNum(currNum, { from: web3.eth.accounts[0], gas: 200000 }, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            var txHash = res;
            console.log(txHash);
            callWhenMined(txHash, getCounter);
        }
    })
}

function callWhenMined(txHash, cb) {
    web3.eth.getTransactionReceipt(txHash, (err, rcpt) => {
        if (err) {
            console.log(err);
        } else {
            if (!rcpt) {
                setTimeout(() => {
                    console.log('checking')
                    callWhenMined(txHash, cb);
                }, 500)
            } else {
                console.log('mined');
                cb();
            }
        }
    })
}