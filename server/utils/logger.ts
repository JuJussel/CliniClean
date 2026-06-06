import pino from 'pino';
import fs from 'node:fs';

// Ensure the local logs directory exists
const logDir = './logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Configure Pino to write to a local file
const fileTransport = pino.transport({
  target: 'pino/file',
  options: { 
    destination: `${logDir}/nitro-server.log`,
    append: true 
  }
});

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
  },
  fileTransport
);