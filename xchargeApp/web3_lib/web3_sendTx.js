const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const web3 = new Web3();

async function createTx(addressFrom, addressTo, data, valueInFinney) {
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

  if (valueInFinney !== null) {
    txData = Object.assign(
      { value: web3.utils.toWei(valueInFinney.toString(), 'milliether') },
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
  valueInFinney,
  addressFromPrivateKey
) {
  const txData = await createTx(
    addressFrom,
    addressTo,
    encodeData,
    valueInFinney
  );
  const signedTx = signTx(txData, addressFromPrivateKey);

  return new Promise(function(resolve, reject) {
    web3.eth
      .sendSignedTransaction('0x' + signedTx)
      .on('receipt', function(receipt) {
        resolve(receipt);
      })
      .on('error', function(error) {
        reject(error);
      });
  });
}

async function send(
  addressFrom,
  addressTo,
  encodeData,
  valueInFinney,
  addressFromPrivateKey,
  web3Provider
) {
  web3.setProvider(web3Provider);
  return await sendSignedTx(
    addressFrom,
    addressTo,
    encodeData,
    valueInFinney,
    addressFromPrivateKey
  );
}

module.exports = send;
