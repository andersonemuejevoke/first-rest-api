const { format } = require('date-fns');
const { randomUUID } = require('crypto');
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const logEvents = async (message, logName) => {
  const dateTime = format(new Date(), 'yyyy-MM-dd\tHH:mm:ss');
  const logItem = `${dateTime}\t${randomUUID()}\t${message}\n`;

  try {
    await fsPromises.mkdir(path.join(__dirname, '..', 'logs'), {
      recursive: true,
    });
    await fsPromises.appendFile(
      path.join(__dirname, '..', 'logs', logName),
      logItem,
    );
  } catch (err) {
    console.error(err.message);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
  next();
};

module.exports = { logger, logEvents };
