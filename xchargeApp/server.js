

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
    // call ropsten node
})

app.get('/rinkeby', (req, res) => {
    runningPi = 'B';
    // call kovan to extract deposit

    // take deposit to rinkeby 
    // call rinkeby node
})

app.get('/stop', (req, res) => {
    // stop running pi

    // reclaim remaining funds
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
