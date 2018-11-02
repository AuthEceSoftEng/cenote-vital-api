const express = require('express');
const path = require('path');
const auth = require('./auth');
const user = require('./user');
const users = require('./users');
const projects = require('./projects');

const router = express.Router();

router.use('/api/auth', auth);
router.use('/api/user', user);
router.use('/api/users', users);
router.use('/api/projects', projects);

router.get('/works', (req, res) => {
	res.send('<h1 align="center">It does!</h1>');
});

const root = path.join(__dirname, '../../client/dist');
router.use(express.static(root));
router.get('/*', (req, res) => {
	res.sendFile('index.html', { root });
});

module.exports = router;
