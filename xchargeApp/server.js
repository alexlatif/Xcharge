

const express = require('express');
var path = require('path');
const app = express();



// Serve up content from public directory
app.use(express.static(__dirname + '/public'));

app.listen(3000, () => console.log('Example app listening on port 3000!'))
