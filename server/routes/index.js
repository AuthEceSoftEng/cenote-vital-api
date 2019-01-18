const express = require('express');
const path = require('path');
const auth = require('./auth');
const organization = require('./organization');
const organizations = require('./organizations');
const projects = require('./projects');

const router = express.Router();

router.use('/api/auth', auth);
router.use('/api/organization', organization);
router.use('/api/projects', projects);
router.use('/api/organizations', organizations);

router.get('/works', (req, res) => {
  res.send('<h1 align="center">It does!</h1>');
});

const root = path.join(__dirname, '../../client/dist');
router.use(express.static(root));
router.get('/*', (req, res) => {
  res.sendFile('index.html', { root });
});

module.exports = router;
