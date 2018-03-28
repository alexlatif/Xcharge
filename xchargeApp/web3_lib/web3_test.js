const lib = require('./index');

// lib.kind('ropsten').then(function(result) {
//   console.log('kind', result);
// });
//
// lib.name('ropsten').then(function(result) {
//   console.log('name', result);
// });
//
// lib.rate('ropsten').then(function(result) {
//   console.log('rate', result);
// });
//
// lib.showBalance('ropsten').then(function(result) {
//   console.log('showBalance contract', result);
// });
//
// lib.showFundsOf(lib.user.test.address, 'ropsten').then(function(result) {
//   console.log('showFundsOf', result);
// });

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

lib.depositFunds(lib.user.test.address, 4).then(function() {
  console.log('depositFunds -> OK.');
});
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
