const winston = require('winston');
const globalConfig = require('../../config/logging.config')
const path = require('path')
const root = path.resolve('logs')

const logDirectory = globalConfig.logDirectory ? globalConfig.logDirectory : root

const levels = {
  error: 0,
  http: 1,
  info: 2
}

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
)

const transports = [
  new winston.transports.File({
    level: 'error',
    filename: path.resolve(logDirectory, "error.log") ,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }),
  new winston.transports.File({ 
    filename: path.resolve(logDirectory, "all.log") ,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5
  })
]

const loggerConst = winston.createLogger({
    levels,
    format,
    transports
})

// Add Console Logger as needed
if (globalConfig.logToConsole) {
  loggerConst.add(new winston.transports.Console({level: 'error'}))
}

// Add Graylog if configured
if (globalConfig.grayLog) {
  const winstonGraylog2 = require('winston-graylog2')
  loggerConst.add(new winstonGraylog2(globalConfig))
}

loggerConst.stream = {
    write: function(message, encoding) {
      loggerConst.http(message.substring(0,message.lastIndexOf('\n'))); // Remove linebreak
    }
}
   
module.exports = loggerConst;