"use strict";

const fs = require('fs');

module.exports = class BuildSimulator {
  timeoutIds = [];
  logIndices = [];
  mockSteps = [];
  buildObj;
  data;

  constructor() {
    this.buildObj = JSON.parse(fs.readFileSync('mock_build.json', 'utf8'));
    this.data = this.setMocks(this.buildObj);
  }

  setMocks(buildData) {
    const {steps} = buildData;
    const stepsNoLogs = [];
    const stepLogs = [];
    steps.forEach((step, index) => {
      const {logs, ...rest} = step;
      stepLogs.push(logs);
      stepsNoLogs.push({id: index, ...rest});
      this.logIndices.push(logs.length - 1);
      this.mockSteps.push({id: index, ...rest});
    });
    return {steps: stepsNoLogs, logs: stepLogs};
  }

  sendLogs(connection, stepId) {
    if (stepId !== null && stepId >= 0 && stepId < this.mockSteps.length) {
      if (this.mockSteps[stepId].status === 'success' || this.mockSteps[stepId].status === 'inProgress' || this.mockSteps[stepId].status === 'failure') {
        this.generateLogStreamSimulation(connection, stepId);
      }
    }
  }

  generateLogStreamSimulation(connection, stepId) {
    this.clearMessages();
    const log = this.data.logs[stepId];
    if (this.logIndices[stepId] >= 0) {
      this.generateStreamOfPerformedLogs(connection, stepId, log);
    }
    this.generateStreamOfUnperformedLogs(connection, stepId, log);
  }

  generateStreamOfPerformedLogs(connection, stepId, log) {
    const chunkSize = 100;
    for (let i = 0; i <= this.logIndices[stepId]; i += chunkSize) {
      const start = i;
      const end = (i + chunkSize < this.logIndices[stepId]) ? i + chunkSize : this.logIndices[stepId];
      this.timeoutIds.push(setTimeout(() => {
        connection.send(JSON.stringify({performed: log.slice(start, end + 1), stepId: stepId}));
      }, 0));
    }
  }

  generateStreamOfUnperformedLogs(connection, stepId, log) {
    for (let i = this.logIndices[stepId] + 1; i < log.length; i++) {
      const delay = Math.floor(Math.random() * 1000 * i);
      this.timeoutIds.push(setTimeout(() => {
        this.logIndices[stepId]++;
        connection.send(JSON.stringify({line: log[i], stepId: stepId}));
        this.updateStepStatus(connection, stepId);
      }, delay));
    }
  }

  restartBuild() {
    this.clearMessages();
    for (let i = 0; i < this.mockSteps.length; i++) {
      if (i === 0) {
        this.mockSteps[i].status = 'inProgress';
        this.logIndices[i] = 0;
      } else {
        this.mockSteps[i].status = 'unknown';
        this.logIndices[i] = -1;
      }
    }
  }

  clearMessages() {
    if (this.timeoutIds.length > 0) {
      this.timeoutIds.forEach(id => clearTimeout(id));
      this.timeoutIds.length = 0;
    }
  }

  updateStepStatus(connection, stepId) {
    if (this.mockSteps[stepId].status === 'inProgress' && this.logIndices[stepId] === this.data.logs[stepId].length - 1) {
      this.mockSteps[stepId].status = this.data.steps[stepId].status;
      if (this.mockSteps[stepId].status === 'success' && stepId < this.data.steps.length - 1) {
        const nextId = 1 + parseInt(stepId);
        this.mockSteps[nextId].status = 'inProgress';
      }
      connection.send(JSON.stringify({statusUpdate: 'BUILD_STATUS_HAS_CHANGED'}));
    }
  }
}
