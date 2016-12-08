require('./lib/env');

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

app.httpsPort = process.env.SYNC_WEB_STUB_HTTPS_PORT;
app.httpPort = process.env.SYNC_WEB_STUB_HTTP_PORT;

var keyPath = process.env.SYNC_WEB_STUB_CERTS_DIR + '/key';
var certPath = process.env.SYNC_WEB_STUB_CERTS_DIR + '/crt';
var caPath = process.env.SYNC_WEB_STUB_CERTS_DIR + '/ca';

try {  
  if (!fs.existsSync(keyPath)) {
    throw new Error('Server failed to find SSL key file');
  }

  if (!fs.existsSync(certPath)) {
    throw new Error('Server failed to find SSL certificate file');
  }

  if (!fs.existsSync(caPath)) {
    throw new Error('Server failed to find SSL intermediate CA certificate file');
  }

	https.createServer({
	  key: fs.readFileSync(keyPath, 'utf8'),
	  cert: fs.readFileSync(certPath, 'utf8'),
	  ca: fs.readFileSync(caPath, 'utf8')
	}, app).listen(app.httpsPort);

	http.createServer(app).listen(app.httpPort);

	module.exports = app;

	console.info('Server listening for HTTPS requests on', app.httpsPort);
	console.info('Server listening for HTTP requests on', app.httpPort);
} catch (error) {
  console.error(error.message);
  throw error;
}