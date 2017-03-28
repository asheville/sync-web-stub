# Sync web stub

This repository contains the source code for a website that collects email addresses from visitors who want to be notified about the release of [sync-web](https://github.com/asheville/sync-web).

It contains a corresponding server and relies on [sync-server](https://github.com/asheville/sync-server) to process contact verification requests and store notification preferences on behalf of newly generated users.

## Setting up the environment

The code requires several environment variables either to run the server or to deploy it to another system. The following environment variables can be declared by adding a file named `.env` (in [INI format](https://en.wikipedia.org/wiki/INI_file)) to the base directory, assuming they're not declared elsewhere in the system already. Such a file will be ignored by Git.

- `SYNC_WEB_STUB_HTTPS_PORT`: Port through which to serve HTTPS requests with the app (e.g. `443`; required to run app)
- `SYNC_WEB_STUB_HTTP_PORT`: Port through which to serve HTTP requests with the app (e.g. `80`; required to run app)
- `SYNC_WEB_STUB_SERVER_HOST`: Host URL of [sync-server](https://github.com/asheville/sync-server), including port (e.g. `127.0.0.1:9090`)
- `SYNC_WEB_STUB_CERTS_DIR`: Local system path to a directory with the SSL certificate files `key`, `crt` and `ca` needed by the app to serve HTTPs requests (e.g. `/Users/me/sync-web-stub/.certs`; required to run app)
- `SYNC_WEB_STUB_DEPLOY_HOST_USERNAME`: User name with which to SSH into remote deployment server (e.g. `root`; required to deploy app)
- `SYNC_WEB_STUB_DEPLOY_HOST`: Host address for the remote deployment server (e.g. `example.com`; required to deploy app)
- `SYNC_WEB_STUB_DEPLOY_HOST_DIR`: Remote system path to app directory on deployment server (e.g. `/var/www/sync-web-stub`; required to deploy app)
- `SYNC_WEB_STUB_DEPLOY_CERTS_DIR`: Local system path to a directory with the SSL certificate files `key`, `crt` and `ca` needed by the app to serve HTTPs requests *remotely on the deployment server* (e.g. `/Users/me/sync-web-stub/.certs-deploy`; required to deploy app). This directory will be copied to `.certs` within the base directory of the app on the deployment server so the environment variable `SYNC_WEB_STUB_CERTS_DIR` must be set to `.certs` in the deployment environment unless this directory is later moved.

Note that you can create directories called `.certs` and `.certs-deploy` within the base directory to satisfy the `SYNC_WEB_STUB_CERTS_DIR` and `SYNC_WEB_STUB_DEPLOY_CERTS_DIR` variables and they will be ignored by Git.

If you intend to deploy the server to another system using scripts within the "Developing and deploying the server" section below, you can also create a `.env-deploy` file in the base directory, one that will be ignored by Git and used upon deployment to create an `.env` file remotely, thereby setting environment variables on the deployment server.

## Developing and deploying the server

After establishing your environment per the instructions above, you can run any of the following scripts to help with development and deployment:

- `npm run build`: Builds app from source into static files that contain environment-specific features and places them under `build` directory
- `npm run dev`: Runs the app and automatically reloads it when code changes are made during development
- `npm run deploy`: Runs all tests locally, deploys environment and certificate file dependencies, deploys the app remotely, runs `npm install` remotely to ensure the installation of dependencies, and builds remotely
- `npm run deploy-dependencies`: Deploys environment and certificate file dependencies.
- `npm run deploy-app`: Deploys the app remotely, runs `npm install` remotely to ensure the installation of dependencies, and builds remotely

If you add `forever` to any of the deployment scripts (e.g. `npm run deploy forever`), [forever](https://github.com/foreverjs/forever) will be used to start or restart the app remotely post-deployment. Ensure that Node with NPM and forever are installed remotely before appending this script.

If you add `systemd` to any of the deployment scripts (e.g. `npm run deploy systemd`), [systemd](https://www.digitalocean.com/community/tutorials/systemd-essentials-working-with-services-units-and-the-journal) will be used to start or restart the app remotely post-deployment. Ensure that Node and systemd with a service for the app called `syncwebstub` are installed remotely before running this script.