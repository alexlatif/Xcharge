const lib = require('./index');

async function testRead() {
  const ropstenKind = await lib.kind('ropsten');
  console.log('ropsten kind', ropstenKind);
  const ropstenName = await lib.name('ropsten');
  console.log('ropsten name', ropstenName);
  const ropstenRate = await lib.rate('ropsten');
  console.log('ropsten rate', ropstenRate);
  const ropstenShowBalance = await lib.showBalance('ropsten');
  console.log('ropsten show balance of contract', ropstenShowBalance);
  const ropstenShowFundsOf = await lib.showFundsOf(
    lib.user.node.address,
    'ropsten'
  );
  console.log(
    'ropsten show funds of user:',
    lib.user.node.address,
    ropstenShowFundsOf
  );

  const rinkebyKind = await lib.kind('rinkeby');
  console.log('rinkeby kind', rinkebyKind);
  const rinkebyName = await lib.name('rinkeby');
  console.log('rinkeby name', rinkebyName);
  const rinkebyRate = await lib.rate('rinkeby');
  console.log('rinkeby rate', rinkebyRate);
  const rinkebyShowBalance = await lib.showBalance('rinkeby');
  console.log('rinkeby show balance of contract', rinkebyShowBalance);
  const rinkebyShowFundsOf = await lib.showFundsOf(
    lib.user.node.address,
    'rinkeby'
  );
  console.log(
    'rinkeby show funds of user:',
    lib.user.node.address,
    rinkebyShowFundsOf
  );
}

//testRead();
// lib
//   .deposit(
//     lib.user.test.address,
//     40,
//     lib.user.customer.address,
//     'ropsten'
//   )
//   .then(function() {
//     console.log('deposit -> OK.');
//     lib
//       .showFundsOf(lib.user.customer.address, 'ropsten')
//       .then(function(result) {
//         console.log('showFundsOf customer', result);
//       });
//   });

// lib.reclaim(lib.user.customer.address, 'ropsten').then(function() {
//   console.log('reclaim -> OK.');
//   lib.showFundsOf(lib.user.customer.address, 'ropsten').then(function(result) {
//     console.log('showFundsOf customer', result);
//   });
// });

// lib
//   .startCharging(
//     lib.user.test.address,
//     lib.user.customer.address,
//     Date.now(),
//     'ropsten'
//   )
//   .then(function() {
//     console.log('startCharging -> OK.');
//   });
//
// lib
//   .stopCharging(
//     lib.user.test.address,
//     lib.user.customer.address,
//     30000,
//     Date.now(),
//     'ropsten'
//   )
//   .then(function() {
//     console.log('stopCharging -> OK.');
//     lib
//       .showFundsOf(lib.user.customer.address, 'ropsten')
//       .then(function(result) {
//         console.log('showFundsOf customer', result);
//       });
//   });

async function depositCustomerFunds() {
  const reuslt = await lib.depositFunds(lib.user.customer.address, 4);
  console.log(reuslt);
}

//depositCustomerFunds();
// lib.reclaimFunds(lib.user.test.address).then(function() {
//   console.log('reclaimFunds -> OK.');
// });

//  user: address
//  amount: unit256
// lib.useFunds(lib.user.test.address, 1).then(function() {
//   console.log('useFunds -> OK.');
// });

//  sender: address,
//  valueInFinney: unit256
//  user: address
// lib.refund(lib.user.test.address, 40, lib.user.test.address).then(function() {
//   console.log('refund -> OK.');
// });
