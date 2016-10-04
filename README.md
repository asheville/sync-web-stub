This repository contains the source code for a website that collects email addresses from visitors who want to be notified about the release of [sync-web](https://github.com/asheville/sync-web).

It contains a corresponding server and relies on [sync-server](https://github.com/asheville/sync-server) to process contact verification requests and store notification preferences on behalf of newly generated users.

The following environment variables are required:

- `SYNC_WEB_STUB_HTTPS_PORT`: Port through which to serve this website with HTTPS (e.g. 9091)
- `SYNC_WEB_STUB_HTTP_PORT`: Port through which to serve this website with HTTP (e.g. 80)
- `SYNC_WEB_STUB_SSL_KEY`: Path to local SSL key file (e.g. ~/.ssh/certs/sync-web-stub.key)
- `SYNC_WEB_STUB_SSL_CRT`: Path to local SSL certificate file (e.g. ~/.ssh/certs/sync-web-stub.crt)
- `SYNC_WEB_STUB_SSL_INT_CRT`: Path to local SSL intermediate CA certificate file (e.g. ~/.ssh/certs/sync-web-stub-int.crt)
- `SYNC_WEB_STUB_SERVER_HOST`: Host URL of [sync-server](https://github.com/asheville/sync-server), including port

To build the website, install [NPM](https://npmjs.com) and [Grunt](http://gruntjs.com) then run `npm install` and `grunt build`.

To run the server during development while watching for both server and source file changes, run `grunt dev`.