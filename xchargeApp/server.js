
var http = require('http'),
    fs = require('fs');


fs.readFile('index.html', function (err, html) {
    if (err) {
        throw err;
    }
    http.createServer(function (request, response) {
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(html);
        response.end();
    }).listen(3000, (err) => {
        if (err) throw err;
        console.log('Ready On localhost:3000');
    })
});