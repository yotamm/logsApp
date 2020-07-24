const fs = require('fs');
const buildObj = JSON.parse(fs.readFileSync('mock_build.json', 'utf8'));
const data = getMocks(buildObj);
const timeoutIds = [];

//http requests
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer((request, response) => {
  console.log('Received request for ' + request.url);
  if (request.url === '/build-info' && request.method === 'GET') {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.writeHead(200, {'Access-Control-Allow-Origin': '*'});
    response.end(JSON.stringify(data.steps));
  }
});
const port = 8080;
server.listen(port, () => console.log('server is listening on port ' + port));

//websocket requests
const wsServer = new WebSocketServer({httpServer: server});
wsServer.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  connection.on('message', function(message) {
    console.log('Received Message: ', message.utf8Data);
    const {stepId} = JSON.parse(message.utf8Data);
    sendLogs(connection, stepId);
  });
  connection.on('close', function(reasonCode, description) {
    console.log('Client has disconnected.');
  });
});

//utils
function getMocks(buildData) {
  const {steps} = buildData;
  const stepsNoLogs = [];
  const stepLogs = [];
  steps.forEach((step, index) => {
    const {logs, ...rest} = step;
    stepLogs.push(logs);
    stepsNoLogs.push({id: index, ...rest});
  });
    return {steps: stepsNoLogs, logs: stepLogs};
}

function sendLogs(connection, stepId) {
  if (stepId >= 0 && stepId < data.logs.length && stepId !== null) {
    if (timeoutIds.length > 0) {
      timeoutIds.forEach(id => clearTimeout(id));
      timeoutIds.length = 0;
    }
    const log = data.logs[stepId];
    for (let i = 0; i < log.length; i++) {
      const delay = Math.floor(Math.random() * 1000 * i);
      timeoutIds.push(setTimeout(() => {
        connection.send(JSON.stringify(log[i]));
      }, delay));
    }
  }
}
