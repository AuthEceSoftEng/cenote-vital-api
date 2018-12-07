const express = require('express');
const passport = require('passport');
const Organization = require('../models/Organization');

const router = express.Router();

router.post('/register', (req, res) => {
	if (!req || !req.body || !req.body.username || !req.body.password) {
		res.status(400).send({ message: 'Username and Password required' });
	}

	req.body.usernameCase = req.body.username;
	req.body.username = req.body.username.toLowerCase();

	const { username } = req.body;
	const newOrganization = Organization(req.body);

	Organization.find({ username }, (err, organizations) => {
		if (err) {
			res.status(400).send({ message: 'Create organization failed', err });
		}
		if (organizations[0]) {
			res.status(400).send({ message: 'Username exists' });
		}

		newOrganization.hashPassword().then(() => {
			newOrganization.save((err2, savedOrganization) => {
				if (err2 || !savedOrganization) {
					res.status(400).send({ message: 'Create organization failed', err2 });
				} else {
					res.send({ message: 'Organization created successfully', organization: savedOrganization.hidePassword() });
				}
			});
		});
	});
});

router.post('/login', (req, res, next) => {
	req.body.username = req.body.username.toLowerCase();

	passport.authenticate('local', (err, organization, info) => {
		if (err) return next(err);
		if (info && info.message === 'Missing credentials') return res.status(401).send({ message: 'Missing credentials' });
		if (!organization) return res.status(401).send(info);

		return req.login(organization, (err2) => {
			if (err2) res.status(401).send({ message: 'Login failed', err2 });
			res.send({ message: 'Logged in successfully', organization: organization.hidePassword() });
		});
	})(req, res, next);
});

router.post('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			res.status(400).send({ message: 'Logout failed', err });
		}
		req.sessionID = null;
		req.logout();
		res.send({ message: 'Logged out successfully' });
	});
});

module.exports = router;
