

const express = require('express');
var path = require('path');
const app = express();

// Serve up content from public directory
app.use(express.static(__dirname + '/public'));

var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://test.mosquitto.org')


var kovanContract;
var ropstenContract;
var rinkebyContract;

var funcLib = require('./web3_lib/index');

app.get('/ropsten', (req, res) => {
    console.log('kovan node to ropsten')
    runningPi = 'A';
    var rate = funcLib.rate('ropsten');
    var available;

    //TODO: Xcharge use funds

   // value availble + rate call

    //TODO: simpleCharger deposit (with time stamp?)

    //TODO: deposit -> startedCharging


    // logic of setTimout to publish stop!! i think it is better to find amountoffunds and divide by rate
    // to get max time
    // if timeout hit Funds[user] = 0

    client.publish('flowA', '1')
    res.json({"success": true})
})


app.get('/rinkeby', (req, res) => {
    runningPi = 'B';
    console.log('kovan node to rinkeby')
    // var rate = funcLib.rate('rinkeby');
    var available;

    //TODO: Xcharge use funds

    //TODO: simpleCharger deposit (with time stamp?)
    //timestamp to find end balance

    //TODO: deposit calls 1) showFundsOf 2) rate 3) startedCharging

    // logic of setTimout to publish stop!! i think it is better to find amountoffunds and divide by rate
    // to get max time
    // if timeout hit Funds[user] = 0

    client.publish('flowB', '1')
    res.json({ "success": true })
})

app.get('/stop', (req, res) => {
    console.log('stop')
    client.publish('flowA', '0')
    client.publish('flowB', '0')

    // clears interval
    // find amount using rate * time
    // reset rate and timestamp to zero
    //TODO:  1)stop 2)reduce

    //TODO: stop charging event -> reclaim funds function
    
    // TODO: 3)deposit in Xcharge
    res.json({ "success": true })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
