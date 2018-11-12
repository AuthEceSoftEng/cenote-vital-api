const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const { requireAuth } = require('./middleware');
const { User } = require('../models');

const router = express.Router();

router.get('/', (req, res) => {
	const user = (req.user && req.user.hidePassword()) || {};

	res.send({ message: 'User info successfully retreived!', user });
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
				User.findByIdAndUpdate({ _id: req.user._id }, { password: hash }, (err3) => {
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
	User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
		if (err || !user) return res.status(400).send({ err, message: 'Password reset token is invalid or has expired!' });
		return bcrypt.genSalt(10, (err2, salt) => {
			if (err2) return res.status(400).send({ err2, message: 'Error updating password!' });
			return bcrypt.hash(newPassword, salt, (err3, hash) => {
				if (err3) return res.status(400).send({ err2, message: 'Error updating password!' });
				user.password = hash;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;
				return user.save((err4) => {
					if (err4) return res.status(400).send({ err2, message: 'Error updating password!' });
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
						subject: 'Your password has been changed!',
						text: `${'Hello,\n\nThis is a confirmation that the password for your account '}${user.email} has just been changed.\n`,
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
		User.findByIdAndUpdate({ _id: req.user._id }, { email: newEmail }, (err) => {
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

	User.findByIdAndUpdate({ _id: req.user._id }, req.body, { new: true }, (err, user) => {
		if (err) {
			res.status(400).send({ err, message: 'Error updating user!' });
		}
		res.status(200).send({ message: 'User successfully updated!', user: user.hidePassword() });
	});
});

module.exports = router;
