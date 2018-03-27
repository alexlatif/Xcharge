const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const xchargeC = require('./Xcharge_web3');

const web3 = new Web3(new Web3.providers.HttpProvider('HTTP://127.0.0.1:8545'));

// NeedProvider

// the address that will send the test transaction
const addressFrom = '0x627306090abaB3A6e1400e9345bC60c78a8BEf57';
const privKey =
  'c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3';

// the destination address (contract)
//const addressTo = '0x1463500476a3ADDa33ef1dF530063fE126203186';

async function createTx(addressFrom, addressTo, data, valueInEth) {
  const nonce = await web3.eth.getTransactionCount(addressFrom);

  let txData = {
    nonce: web3.utils.toHex(nonce),
    to: addressTo,
    from: addressFrom,
    data: data
  };

  if (txData.to === null) {
    delete txData.to;
  }

  if (valueInEth !== null) {
    txData = Object.assign(
      { value: web3.utils.toWei(valueInEth.toString(), 'milliether') },
      txData
    );
  }

  const estimatedGas = await web3.eth.estimateGas(txData);

  txData = Object.assign({ gas: estimatedGas }, txData);

  return txData;
}

function signTx(txData, privateKey) {
  const privateKeyHex = new Buffer(privateKey, 'hex');
  const transaction = new Tx(txData);
  transaction.sign(privateKeyHex);
  const serializedTx = transaction.serialize().toString('hex');
  return serializedTx;
}

async function sendSignedTx(
  addressFrom,
  addressTo,
  encodeData,
  valueInEth,
  addressFromPrivateKey
) {
  const txData = await createTx(addressFrom, addressTo, encodeData, valueInEth);
  const signedTx = signTx(txData, addressFromPrivateKey);

  return new Promise(function(resolve, reject) {
    web3.eth
      .sendSignedTransaction('0x' + signedTx)
      .on('receipt', function(receipt) {
        console.log('YEAH');
        resolve(receipt);
      })
      .on('error', function(error) {
        console.log(':(');
        reject(error);
      });
  });
}

async function deploy() {
  const deploy = xchargeC.depositFunds();

  return await sendSignedTx(
    addressFrom,
    '0xb4c79daB8f259C7Aee6E5b2Aa729821864227e84',
    deploy,
    4,
    privKey
  );
}

deploy().then(function() {
  console.log(':)');
});
