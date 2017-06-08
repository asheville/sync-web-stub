var ranger = require('park-ranger')();
var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var app = express();
var serveStatic = require('serve-static');
var buildDir = __dirname + '/build';

app.use(serveStatic(buildDir + '/assets'));

app.get('/', function(req, res) {
  res.sendFile(buildDir + '/index.html');
});

app.get('/contact-verification-requests/:id', function(req, res) {
  res.sendFile(buildDir + '/contactVerificationRequest.html');
});

app.httpsPort = process.env.SYNC_WEB_STUB_HTTPS_PORT;
app.httpPort = process.env.SYNC_WEB_STUB_HTTP_PORT;

http.createServer(app).listen(app.httpPort, () => {
  console.info('Server listening for HTTP requests on', app.httpPort);
});

if (ranger.cert) {
  https.createServer(ranger.cert, app).listen(app.httpsPort, () => {
    console.info('Server listening for HTTPS requests on', app.httpsPort);
  });
} else {
  console.info('Server not listening for HTTPS requests because certificate files not found');
}

module.exports = app;