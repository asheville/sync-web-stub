var express = require('express');
var app = express();
var server = app.listen(process.env.SYNC_WEB_STUB_PORT);

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

module.exports = app;

console.log('App server started in "%s" env on port %s', app.get('env'), process.env.SYNC_WEB_STUB_PORT);