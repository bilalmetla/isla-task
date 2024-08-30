const pino = require('pino')
const transport = pino.transport({
  target: 'pino/file',
  options: { destination: process.env.LOG_FILE || "./logs.txt", append: true }
})

const logger = pino(transport)
module.exports = logger;