import Web3 from "web3";
let kovan3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    kovan3 = new Web3(window.web3.currentProvider);
}
else {
    const provider = new Web3.providers.HttpProvider(
        'https://kovan.infura.io/DCU9J2Po6i6WwVourC8M'
    );

    kovan3 = new Web3(provider);
}

export default kovan3;