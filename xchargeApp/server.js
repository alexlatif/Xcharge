

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

app.get('/ropsten', (req, res) => {
    runningPi = 'A';
    console.log('kovan node to ropsten')
    //TODO: call kovan to extract deposit

    //TODO: take deposit to ropsten 

    client.publish('flowA', '1')
})


app.get('/rinkeby', (req, res) => {
    runningPi = 'B';
    console.log('kovan node to rinkeby')
    //TODO: call kovan to extract deposit
    //TODO:  take deposit to rinkeby

    client.publish('flowB', '1')
})

app.get('/stop', (req, res) => {
    console.log('stop')
    client.publish('flowA', '0')
    client.publish('flowB', '0')

    //TODO:  reclaim remaining funds
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
