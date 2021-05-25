const winston = require('winston');
const globalConfig = require('../../config/logging.config')
const path = require('path')

const logDirectory = globalConfig.logDirectory

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
  }),
]

const loggerConst = winston.createLogger({
    levels,
    format,
    transports
})

loggerConst.stream = {
    write: function(message, encoding) {
      loggerConst.http(message.substring(0,message.lastIndexOf('\n'))); // Remove linebreak
    }
}
   
module.exports = loggerConst;