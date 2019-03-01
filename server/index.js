require('dotenv').load();
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const compression = require('compression');

const routes = require('./routes');
const configPassport = require('./config/passport');

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  reconnectTries: 30,
  reconnectInterval: 500,
};
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/cenote-db', mongooseOptions).catch(err => console.error(err.message));

const app = express();

app.use(compression());
app.use(express.static(path.resolve(__dirname, '../dist/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.locals.GLOBAL_LIMIT = process.env.GLOBAL_LIMIT || 5000;
configPassport(app);

app.use('/', routes);

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i += 1) cluster.fork();
  if (process.env.NODE_ENV !== 'test') console.log(chalk.bold.yellow(`>>> Live at http://${host}:${port}`));
  cluster.on('exit', (worker) => {
    console.log(`Worker: ${worker.pid} died. Trying to restart it...`);
    cluster.fork();
  });
} else {
  app.listen(port, host);
}
