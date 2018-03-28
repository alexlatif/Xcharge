const Web3 = require('web3');

const web3 = new Web3();

async function read(
  addressFrom,
  addressTo,
  encodeData,
  valueInFinney,
  decodeInto,
  web3Provider
) {
  web3.setProvider(web3Provider);

  let txData = {
    from: addressFrom,
    to: addressTo,
    data: encodeData
  };

  if (valueInFinney !== null) {
    txData = Object.assign(
      { value: web3.utils.toWei(valueInFinney.toString(), 'milliether') },
      txData
    );
  }

  const result = await web3.eth.call(txData);
  return web3.eth.abi.decodeParameter(decodeInto, result);
}

module.exports = read;
