const winston = require('winston');
const globalConfig = require('../../config/logging.config')
const path = require('path')

const logDirectory = globalConfig.logDirectory

var options = {
    infofile: {
        level: "info",
        filename: path.resolve(logDirectory, "info.log"),
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5
    },
    errorfile: {
        level: "error",
        filename: path.resolve(logDirectory, "error.log"),
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5
    },
    console: {
        level: "info",
        handleExceptions: true,
        format: winston.format.simple(),  // disable json format
        colorize: true
    }
}

const logger = winston.createLogger({
    transports: [
      new winston.transports.File(options.infofile),
      new winston.transports.File(options.errorfile),
      new winston.transports.Console(options.console)
    ]
})

// create a stream object with a 'write' function that will be used by `morgan`. This stream is based on node.js stream https://nodejs.org/api/stream.html.
logger.stream = {
    write: function(message, encoding) {
      // use the 'info' log level so the output will be picked up by both transports
      logger.info(message);
    }
}

logger.combinedFormat = function(err, req, res) {
    // Similar combined format in morgan
    // :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
    return `${req.ip} - - [${clfDate(
      new Date()
    )}] \"${req.method} ${req.originalUrl} HTTP/${req.httpVersion}\" ${err.status ||
      500} - ${req.headers["user-agent"]}`
};
   
  module.exports = logger;