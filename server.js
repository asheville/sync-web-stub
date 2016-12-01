require('dotenv').config();
var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var app = express();
var serveStatic = require('serve-static');
var buildDir = __dirname + '/build';

app.use('/assets', serveStatic(buildDir + '/assets'));

app.get('/', function(req, res) {
  res.sendFile(buildDir + '/index.html');
});

app.get('/contactVerificationRequests/:id', function(req, res) {
  res.sendFile(buildDir + '/contactVerificationRequest.html');
});

app.https_port = process.env.SYNC_WEB_STUB_HTTPS_PORT;
app.http_port = process.env.SYNC_WEB_STUB_HTTP_PORT;

https.createServer({
  key: fs.readFileSync(process.env.SYNC_WEB_STUB_SSL_KEY, 'utf8'),
  cert: fs.readFileSync(process.env.SYNC_WEB_STUB_SSL_CRT, 'utf8'),
  ca: fs.readFileSync(process.env.SYNC_WEB_STUB_SSL_INT_CRT, 'utf8')
}, app).listen(app.https_port);

http.createServer(app).listen(app.http_port);

module.exports = app;

console.info('https listening on', app.https_port);
console.info('http listening on', app.http_port);