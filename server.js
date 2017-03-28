require('./lib/env');

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

var keyPath = process.env.SYNC_WEB_STUB_CERTS_DIR + '/key';
var certPath = process.env.SYNC_WEB_STUB_CERTS_DIR + '/crt';
var caPath = process.env.SYNC_WEB_STUB_CERTS_DIR + '/ca';

http.createServer(app).listen(app.httpPort, () => {
  console.info('Server listening for HTTP requests on', app.httpPort);
});

if (fs.existsSync(keyPath) && fs.existsSync(certPath) && fs.existsSync(caPath)) {
  https.createServer({
    key: fs.readFileSync(keyPath, 'utf8'),
    cert: fs.readFileSync(certPath, 'utf8'),
    ca: fs.readFileSync(caPath, 'utf8')
  }, app).listen(app.httpsPort, () => {
    console.info('Server listening for HTTPS requests on', app.httpsPort);
  });
} else {
  console.info('Server not listening for HTTPS requests because certificate files not found');
}

module.exports = app;