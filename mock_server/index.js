const port = 8080;
const timeoutIds = [];
const logIndices = [];
const mockSteps = [];
let wsConnection;
const fs = require('fs');
const buildObj = JSON.parse(fs.readFileSync('mock_build.json', 'utf8'));
const data = getMocks(buildObj);

//http requests
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer((request, response) => {
  console.log('Received request for ' + request.url);
  if (request.url === '/build-info' && request.method === 'GET') {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.writeHead(200, {'Access-Control-Allow-Origin': '*'});
    response.end(JSON.stringify(mockSteps));
  } else if (request.url === '/restart-build' && request.method === 'GET') {
    restartBuild();
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.writeHead(200, {'Access-Control-Allow-Origin': '*'});
    response.end(JSON.stringify(mockSteps));
  }
});

server.listen(port, () => console.log('server is listening on port ' + port));

//websocket requests
const wsServer = new WebSocketServer({httpServer: server});
wsServer.on('request', (request) => {
  wsConnection = request.accept(null, request.origin);
  wsConnection.on('message', function (message) {
    console.log('Received Message: ', message.utf8Data);
    const {stepId} = JSON.parse(message.utf8Data);
    sendLogs(wsConnection, parseInt(stepId));
  });
  wsConnection.on('close', function (reasonCode, description) {
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
    logIndices.push(logs.length - 1);
    mockSteps.push({id: index, ...rest});
  });
  return {steps: stepsNoLogs, logs: stepLogs};
}

function sendLogs(connection, stepId) {
  if (stepId !== null && stepId >= 0 && stepId < mockSteps.length) {
    if (mockSteps[stepId].status === 'success' || mockSteps[stepId].status === 'inProgress' || mockSteps[stepId].status === 'failure') {
      randomizeSendingTime(connection, stepId);
    }
  }
}

function randomizeSendingTime(connection, stepId) {
  clearMessages();
  const log = data.logs[stepId];
  if (logIndices[stepId] >= 0) {
    // logs already generated. push to client quickly
    const chunkSize = 100;
    for (let i = 0; i <= logIndices[stepId]; i += chunkSize) {
      const start = i;
      const end = (i + chunkSize < logIndices[stepId]) ? i + chunkSize : logIndices[stepId];
      timeoutIds.push(setTimeout(() => {
        connection.send(JSON.stringify({performed: log.slice(start, end + 1)}));
      }, 0));
    }
  }
  for (let i = logIndices[stepId] + 1; i < log.length; i++) {
    const delay = Math.floor(Math.random() * 1000 * i);
    timeoutIds.push(setTimeout(() => {
      logIndices[stepId]++;
      connection.send(JSON.stringify({line: log[i]}));
      updateStepStatus(stepId);
    }, delay));
  }
}

function restartBuild() {
  clearMessages();
  for (let i = 0; i < mockSteps.length; i++) {
    if (i === 0) {
      mockSteps[i].status = 'inProgress';
      logIndices[i] = 0;
    } else {
      mockSteps[i].status = 'unknown';
      logIndices[i] = -1;
    }
  }
}

function clearMessages() {
  if (timeoutIds.length > 0) {
    timeoutIds.forEach(id => clearTimeout(id));
    timeoutIds.length = 0;
  }
}

function updateStepStatus(stepId) {
  if (mockSteps[stepId].status === 'inProgress' && logIndices[stepId] === data.logs[stepId].length - 1) {
    mockSteps[stepId].status = data.steps[stepId].status;
    if (mockSteps[stepId].status === 'success' && stepId < data.steps.length - 1) {
      const nextId = 1 + parseInt(stepId);
      mockSteps[nextId].status = 'inProgress';

    }
    wsConnection.send({statusUpdate: 'BUILD_STATUS_HAS_CHANGED'});
  }
}
