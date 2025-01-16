const options = { level: process.env.LOG_LEVEL || 'info' };

module.exports = require('pino')(options);
