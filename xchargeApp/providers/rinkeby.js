import Web3 from "web3";
let rinkeby3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
    rinkeby3 = new Web3(window.web3.currentProvider);
}
else {
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/DCU9J2Po6i6WwVourC8M'
    );

    rinkeby3 = new Web3(provider);
}

export default rinkeby3;