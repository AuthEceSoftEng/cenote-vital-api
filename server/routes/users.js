const express = require('express');

const { User } = require('../models');

const router = express.Router();

router.post('/checkusername', (req, res) => {
	const username = req.body.username.toLowerCase();
	User.findOne({ username }, (err, user) => {
		if (err) return res.status(400).send({ message: 'Check username failed', err, username });
		if (user) return res.send({ available: false, message: 'Username exists', username });
		return res.send({ available: true, message: 'Username available', username });
	});
});

module.exports = router;
