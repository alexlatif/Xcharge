

const express = require('express');
var path = require('path');
const app = express();

var url = "http://localhost:3000/";

var kovanContract;
var ropstenContract;
var rinkebyContract;

// Serve up content from public directory
app.use(express.static(__dirname + '/public'));

app.get(url + '/kovan', (req, res) => {
    
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))
