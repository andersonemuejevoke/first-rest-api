const { logEvents } = require('./logEmitters');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
  res.status(500).send(err.message);
};
module.exports = errorHandler;
