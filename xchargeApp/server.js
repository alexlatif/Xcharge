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

app.get('/ropsten', async (req, res) => {
    console.log('kovan node to ropsten')
    runningPi = 'A';
    var chain = 'ropsten'
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
    var ts1 = Math.round((new Date()).getTime() / 1000);

    await funcLib.startCharging(xbanter, customer, ts1, chain)

    client.publish('flowA', '1')

    console.log('3');

    timeout = setTimeout(async () => {
        client.publish('flowA', '0')
        var ts2 = Math.round((new Date()).getTime() / 1000);
        var sendAmount = value / rate;
        await funcLib.stopCharging(xbanter, customer, sendAmount, ts2, chain);
        console.log('4');
    }, timeAvailable);

    res.json({"success": true})
})


app.get('/rinkeby', async (req, res) => {
    runningPi = 'B';
    console.log('kovan node to rinkeby')
    var chain = 'rinkeby'
    rate = await funcLib.rate(chain);
    value = 10000;  // 20 seconds @ 500/s rate (in szabo)
    var timeAvailable = value / rate * 1000;
    console.log(rate);

    // sending amount in wei
    await funcLib.useFunds(xbanter, web3.utils.toWei(value.toString(), 'szabo'));

    // sending value in finney
    var finneyAmount = value / 1000;
    await funcLib.deposit(xbanter, finneyAmount, customer, chain)

    // time stamp in unix
    var ts1 = Math.round((new Date()).getTime() / 1000);

    await funcLib.startCharging(xbanter, customer, ts1, chain)

    client.publish('flowB', '1')

    timeout = setTimeout(async () => {
        client.publish('flowB', '0')
        var ts2 = Math.round((new Date()).getTime() / 1000);
        var sendAmount = value / rate;
        await funcLib.stopCharging(xbanter, customer, sendAmount, ts2, chain)
    }, timeAvailable);

    res.json({ "success": true })
})

app.get('/stop', async (req, res) => {
    console.log('stop')
    client.publish('flowA', '0')
    client.publish('flowB', '0')

    var ts2 = Math.round((new Date()).getTime() / 1000);
    await funcLib.stopCharging(customer, value, ts2)

    console.log('1');

    var sendAmount = (value / rate) - (ts2 - ts1);
    clearTimeout(timeout);
    value = 0;
    rate = 0;
    await funcLib.stopCharging(customer, sendAmount, ts2)

    console.log('2');

    await funcLib.reclaim(customer);

    console.log('3');

    await funcLib.depositFunds(xbanter, value - (sendAmount * rate));

    console.log('4');
    res.json({ "success": true })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
