const bunyan = require('bunyan')
const BunyanFormat = require('bunyan-format')
const supportsColor = require('supports-color')

function toBunyanLogLevel (level) {
  switch (level) {
    case 'info':
    case 'trace':
    case 'debug':
    case 'warn':
    case 'error':
    case 'fatal':
    case undefined:
      return level
    default:
      throw new Error('Invalid log level')
  }
}

function toBunyanFormat (format) {
  switch (format) {
    case 'short':
    case 'long':
    case 'simple':
    case 'json':
    case 'bunyan':
    case undefined:
      return format
    default:
      throw new Error('Invalid log format')
  }
}

module.exports = bunyan.createLogger({
  level: toBunyanLogLevel(process.env.LOG_LEVEL || 'info'),
  name: 'ElectionBot',
  serializers: bunyan.stdSerializers,
  stream: new BunyanFormat({
    color: supportsColor.stdout,
    levelInString: !!process.env.LOG_LEVEL_IN_STRING,
    outputMode: toBunyanFormat(process.env.LOG_FORMAT || 'short')
  })
})
