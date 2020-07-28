'use strict';

const port = 8080;
const BuildSimulator = require('./build-simulator');
const buildSimulator = new BuildSimulator();

//http requests
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer((request, response) => {
  console.log('Received request for ' + request.url);
  function prepResponse() {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.writeHead(200, {'Access-Control-Allow-Origin': '*'});
  }
  if (request.method === 'GET') {
    if (request.url === '/build-info') {
      prepResponse();
      response.end(JSON.stringify(buildSimulator.mockSteps));
    } else if (request.url === '/restart-build') {
      buildSimulator.restartBuild();
      prepResponse();
      response.end(JSON.stringify(buildSimulator.mockSteps));
    }
  }
});

server.listen(port, () => console.log('server is listening on port ' + port));

//websocket requests
const wsServer = new WebSocketServer({httpServer: server});
wsServer.on('request', (request) => {
  const wsConnection = request.accept(null, request.origin);
  wsConnection.on('message', function (message) {
    console.log('Received Message: ', message.utf8Data);
    const {stepId} = JSON.parse(message.utf8Data);
    buildSimulator.sendLogs(wsConnection, stepId);
  });
  wsConnection.on('close', function (reasonCode, description) {
    console.log('Client has disconnected.');
  });
});
