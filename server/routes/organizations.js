const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const uuidv5 = require('uuid/v5');

const { requireAuth } = require('./middleware');
const { Organization } = require('../models');

const router = express.Router();

router.get('/', (req, res) => {
	const organization = (req.user && req.user.hidePassword()) || {};

	res.send({ message: 'Organization info successfully retreived!', organization });
});

router.put('/password', requireAuth, (req, res) => {
	const { oldPassword, newPassword } = req.body;

	if (req.user.validPassword(oldPassword)) {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				res.status(400).send({ err, message: 'Error updating password!' });
			}
			bcrypt.hash(newPassword, salt, (err2, hash) => {
				if (err2) {
					res.status(400).send({ err2, message: 'Error updating password!' });
				}
				Organization.findByIdAndUpdate({ _id: req.user._id }, { password: hash }, (err3) => {
					if (err3) {
						res.status(400).send({ err3, message: 'Error updating password!' });
					}
					res.status(200).send({ message: 'Password successfully updated!' });
				});
			});
		});
	} else {
		res.status(400).send({ message: 'Old password did not match!' });
	}
});

router.post('/password', (req, res) => {
	const { newPassword, token } = req.body;
	Organization.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, (err, organization) => {
		if (err || !organization) return res.status(400).send({ err, message: 'Password reset token is invalid or has expired!' });
		return bcrypt.genSalt(10, (err2, salt) => {
			if (err2) return res.status(400).send({ err2, message: 'Error updating password!' });
			return bcrypt.hash(newPassword, salt, (err3, hash) => {
				if (err3) return res.status(400).send({ err2, message: 'Error updating password!' });
				organization.password = hash;
				organization.resetPasswordToken = undefined;
				organization.resetPasswordExpires = undefined;
				return organization.save((err4) => {
					if (err4) return res.status(400).send({ err2, message: 'Error updating password!' });
					const transport = nodemailer.createTransport({
						pool: true,
						host: 'olympus.ee.auth.gr',
						port: 587,
						requireTLS: true,
						auth: { organization: 'protipa@issel.ee.auth.gr', pass: 'qW5Rj3CZbmsN' },
					});
					const message = {
						from: 'BDMS System <no-reply@issel.ee.auth.gr>',
						to: `"${organization.username}" <${organization.email}>`,
						subject: 'Your password has been changed!',
						text: `${'Hello,\n\nThis is a confirmation that the password for your account '
						}${organization.email} has just been changed.\n`,
					};
					return transport.sendMail(message, (err5) => {
						if (err5) res.status(500).send({ message: 'Internal server error!', err5 });
						res.send({ message: 'Success! Your password has been changed.' });
						transport.close();
					});
				});
			});
		});
	});
});

router.put('/email', requireAuth, (req, res) => {
	const { oldEmail, newEmail } = req.body;
	if (req.user.validEmail(oldEmail)) {
		Organization.findByIdAndUpdate({ _id: req.user._id }, { email: newEmail }, (err) => {
			if (err) {
				res.status(400).send({ err, message: 'Error updating email!' });
			}
			res.status(200).send({ message: 'Email successfully updated!' });
		});
	} else {
		res.status(400).send({ message: 'Old email did not match!' });
	}
});

router.put('/', requireAuth, (req, res) => {
	req.body.updatedAt = Date.now();

	Organization.findByIdAndUpdate({ _id: req.user._id }, req.body, { new: true }, (err, organization) => {
		if (err) {
			res.status(400).send({ err, message: 'Error updating organization!' });
		}
		res.status(200).send({ message: 'Organization successfully updated!', organization: organization.hidePassword() });
	});
});

router.post('/checkusername', (req, res) => {
	const username = req.body.username.toLowerCase();
	Organization.findOne({ username }, (err, organization) => {
		if (err) return res.status(400).send({ message: 'Check username failed!', err, username });
		if (organization) return res.send({ available: false, message: 'Username exists!', username });
		return res.send({ available: true, message: 'Username available!', username });
	});
});

router.post('/checkemail', (req, res) => {
	const email = req.body.email.toLowerCase();
	Organization.findOne({ email }, (err, organization) => {
		if (err) return res.status(400).send({ message: 'Check email failed!', err, email });
		if (organization) return res.send({ available: false, message: 'Email exists!', email });
		return res.send({ available: true, message: 'Email available!', email });
	});
});

router.post('/reset', (req, res) => {
	const email = req.body.email.toLowerCase();
	Organization.findOne({ email }, (err, organization) => {
		if (err) return res.status(400).send({ message: 'Check email failed!', err, email });
		if (!organization) return res.status(404).send({ sent: false, message: 'No account with that email address exists!', email });
		const token = uuidv5(req.headers.host, uuidv5.URL);
		organization.resetPasswordToken = token;
		organization.resetPasswordExpires = Date.now() + 3600000; // 1 hour
		return organization.save((err2) => {
			if (err2) return res.status(500).send({ message: 'Internal server error!', err, email });
			const transport = nodemailer.createTransport({
				pool: true,
				host: 'olympus.ee.auth.gr',
				port: 587,
				requireTLS: true,
				auth: { organization: 'protipa@issel.ee.auth.gr', pass: 'qW5Rj3CZbmsN' },
			});
			const message = {
				from: 'BDMS System <no-reply@issel.ee.auth.gr>',
				to: `"${organization.username}" <${organization.email}>`,
				subject: 'BDMS Password Reset',
				text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
					+ 'Please click on the following link, or paste this into your browser to complete the process:\n\n'
					+ 'http://'}${req.headers.host}/reset/${token}\n\n`
					+ 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
			};
			return transport.sendMail(message, (err3) => {
				if (err3) res.status(500).send({ message: 'Internal server error!', err, email });
				res.send({ sent: true, message: `An e-mail has been sent to ${organization.email} with further instructions`, email });
				transport.close();
			});
		});
	});
});

router.get('/reset/:token', (req, res) => {
	Organization.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, organization) => {
		if (!organization) return res.send({ valid: false, message: 'Password reset token is invalid or has expired.' });
		return res.send({ valid: true, message: 'Token is valid!' });
	});
});

module.exports = router;
