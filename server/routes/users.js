const express = require('express');
const uuidv5 = require('uuid/v5');
const nodemailer = require('nodemailer');

const { User } = require('../models');

const router = express.Router();

router.post('/checkusername', (req, res) => {
	const username = req.body.username.toLowerCase();
	User.findOne({ username }, (err, user) => {
		if (err) return res.status(400).send({ message: 'Check username failed!', err, username });
		if (user) return res.send({ available: false, message: 'Username exists!', username });
		return res.send({ available: true, message: 'Username available!', username });
	});
});

router.post('/checkemail', (req, res) => {
	const email = req.body.email.toLowerCase();
	User.findOne({ email }, (err, user) => {
		if (err) return res.status(400).send({ message: 'Check email failed!', err, email });
		if (user) return res.send({ available: false, message: 'Email exists!', email });
		return res.send({ available: true, message: 'Email available!', email });
	});
});

router.post('/reset', (req, res) => {
	const email = req.body.email.toLowerCase();
	User.findOne({ email }, (err, user) => {
		if (err) return res.status(400).send({ message: 'Check email failed!', err, email });
		if (!user) return res.status(404).send({ sent: false, message: 'No account with that email address exists!', email });
		const token = uuidv5(req.headers.host, uuidv5.URL);
		user.resetPasswordToken = token;
		user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
		return user.save((err2) => {
			if (err2) return res.status(500).send({ message: 'Internal server error!', err, email });
			const transport = nodemailer.createTransport({
				pool: true,
				host: 'olympus.ee.auth.gr',
				port: 587,
				requireTLS: true,
				auth: { user: 'protipa@issel.ee.auth.gr', pass: 'qW5Rj3CZbmsN' },
			});
			const message = {
				from: 'BDMS System <no-reply@issel.ee.auth.gr>',
				to: `"${user.username}" <${user.email}>`,
				subject: 'BDMS Password Reset',
				text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
					+ 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
					+ 'http://'}${req.headers.host}/reset/${token}\n\n`
					+ 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
			};
			return transport.sendMail(message, (err3) => {
				if (err3) res.status(500).send({ message: 'Internal server error!', err, email });
				res.send({ sent: true, message: `An e-mail has been sent to ${user.email} with further instructions`, email });
				transport.close();
			});
		});
	});
});

router.get('/reset/:token', (req, res) => {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
		if (!user) return res.send({ valid: false, message: 'Password reset token is invalid or has expired.' });
		return res.send({ valid: true, message: 'Token is valid!' });
	});
});

module.exports = router;
