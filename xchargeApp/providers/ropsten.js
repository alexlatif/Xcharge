import Web3 from "web3";
let ropsten3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    ropsten3 = new Web3(window.web3.currentProvider);
}
else {
    const provider = new Web3.providers.HttpProvider(
        'https://ropsten.infura.io/DCU9J2Po6i6WwVourC8M'
    );

    ropsten3 = new Web3(provider);
}

export default ropsten3;