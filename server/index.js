require('dotenv').load();
const chalk = require('chalk');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./routes');
const configPassport = require('./config/passport');

mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/bdms-db', { useNewUrlParser: true })
	.then(() => console.log('Connected to database.'))
	.catch(err => console.error('Error connecting to database:', err.message));
mongoose.Promise = global.Promise;

const app = express();

app.use(express.static(path.resolve(__dirname, '../dist/')));
app.use(bodyParser.json());
configPassport(app, express);
app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(chalk.bold.rgb(10, 100, 200)(`>>> Server started at http://localhost:${port}`)));
