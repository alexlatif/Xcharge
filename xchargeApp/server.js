const express = require('express');
var path = require('path');
const app = express();
const Web3 = require('web3');
const web3 = new Web3();

// Serve up content from public directory
app.use(express.static(__dirname + '/public'));

var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://test.mosquitto.org')

var funcLib = require('./web3_lib/index');
var xbanter = require('./web3_lib/accounts.json').user.node.address;
var customer = require('./web3_lib/accounts.json').user.customer.address; 

var timeout;
var rate;
var value;
var ts1;
var chain;

var hasStarted = false;

app.get('/ropsten', async (req, res) => {
    console.log('kovan node to ropsten')
    runningPi = 'A';
    chain = 'ropsten'
    rate = await funcLib.rate(chain); // 500
    value = 10000;  // 20 seconds @ 500/s rate (in szabo)
    var timeAvailable = value/rate * 1000;

    // sending amount in wei
    await funcLib.useFunds(customer, web3.utils.toWei(value.toString(), 'szabo'));

    console.log('1');
    
    // sending value in finney
    var finneyAmount = value /1000;
    await funcLib.deposit(xbanter, finneyAmount, customer, chain)

    console.log('2');
    // time stamp in unix
    ts1 = Math.round((new Date()).getTime() / 1000);

    await funcLib.startCharging(xbanter, customer, ts1, chain)

    client.publish('flowA', '1')

    console.log('3');
    hasStarted = true;

    timeout = setTimeout(() => {
        client.publish('flowA', '0')
        var ts2 = Math.round((new Date()).getTime() / 1000);
        var sendAmount = value / rate;
        funcLib.stopCharging(xbanter, customer, sendAmount, ts2, chain);
        console.log('4');
    }, timeAvailable);

    res.json({"success": true})
})


app.get('/rinkeby', async (req, res) => {
    runningPi = 'B';
    console.log('kovan node to rinkeby')
    chain = 'rinkeby'
    rate = await funcLib.rate(chain); // 500
    value = 10000;  // 20 seconds @ 500/s rate (in szabo)
    var timeAvailable = value / rate * 1000;

    // sending amount in wei
    await funcLib.useFunds(customer, web3.utils.toWei(value.toString(), 'szabo'));

    console.log('1');

    // sending value in finney
    var finneyAmount = value / 1000;
    await funcLib.deposit(xbanter, finneyAmount, customer, chain)

    console.log('2');
    // time stamp in unix
    ts1 = Math.round((new Date()).getTime() / 1000);

    await funcLib.startCharging(xbanter, customer, ts1, chain)

    client.publish('flowB', '1')

    console.log('3');

    timeout = setTimeout(() => {
        client.publish('flowB', '0')
        var ts2 = Math.round((new Date()).getTime() / 1000);
        var sendAmount = value / rate;
        funcLib.stopCharging(xbanter, customer, sendAmount, ts2, chain);
        console.log('4');
    }, timeAvailable);

    res.json({ "success": true })
})

app.get('/stop', async (req, res) => {
    console.log('stop')
    client.publish('flowA', '0')
    client.publish('flowB', '0')

    var ts2 = Math.round((new Date()).getTime() / 1000);


    var sendAmount = (value / rate) - (ts2 - ts1);
    clearTimeout(timeout);
    value = 0;
    rate = 0;
    await funcLib.stopCharging(xbanter, customer, sendAmount, ts2, chain)

    console.log('1');

    await funcLib.reclaim(customer, chain);

    console.log('2');

    await funcLib.depositFunds(xbanter, value - (sendAmount * rate));

    console.log('3');
    res.json({ "success": true })
})

app.get('/getstuff', async (req, res) => {
    // read only so can read response from infura
    var balance = await funcLib.getCustomerBalanceOnKovan(customer);

    var obj = {
        balance: balance,
    }

    res.json(JSON.stringify(obj))
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
