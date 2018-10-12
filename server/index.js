require('dotenv').load();
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes');
const configPassport = require('./config/passport');

const mongooseOptions = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false };
mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/bdms-db', mongooseOptions).catch(err => console.error(err.message));

const app = express();

app.use(express.static(path.resolve(__dirname, '../dist/')));
app.use(bodyParser.json());
configPassport(app);
app.use('/', routes);

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
app.listen(port, host, () => console.log(chalk.bold.rgb(0, 255, 255)(`>>> Server started at http://${host}:${port}`)));
