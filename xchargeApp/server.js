

const express = require('express');
var path = require('path');
const app = express();

// Serve up content from public directory
app.use(express.static(__dirname + '/public'));

var kovanContract;
var ropstenContract;
var rinkebyContract;

var timeOut;
var runningPi = ''

app.get('/ropsten', (req, res) => {
    runningPi = 'A';
    //TODO: call kovan to extract deposit

    //TODO: take deposit to ropsten
    //TODO: call ropsten node
})

app.get('/rinkeby', (req, res) => {
    runningPi = 'B';
    //TODO: call kovan to extract deposit

    //TODO: take deposit to rinkeby 
    //TODO: call rinkeby node
})

app.get('/stop', (req, res) => {
    //TODO: stop running pi

    //TODO: reclaim remaining funds
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
