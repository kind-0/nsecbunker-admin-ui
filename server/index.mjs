"use strict";
exports.__esModule = true;
var http = require("http");
// Create the server
var server = http.createServer(function (req, res) {
    // Set the response status code and headers
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    // Write the response body
    res.write('Hello, world!');
    res.end();
});
// Start the server on port 3000
server.listen(3000, function () {
    console.log('Server is listening on port 3000');
});
