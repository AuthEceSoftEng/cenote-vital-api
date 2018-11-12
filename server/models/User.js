const mongoose = require('mongoose');
const { MongooseAutoIncrementID } = require('mongoose-auto-increment-reworked');
const immutablePlugin = require('mongoose-immutable');
const bcrypt = require('bcryptjs');
const R = require('ramda');

const userSchema = new mongoose.Schema({
	username: {
		type: String, lowercase: true, required: true, unique: true, immutable: true,
	},
	usernameCase: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	profilePic: { type: String },
	firstName: { type: String, maxlength: 20 },
	lastName: { type: String, maxlength: 20 },
	bio: { type: String, maxlength: 240 },
	createdAt: { type: Date, default: Date.now, immutable: true },
	updatedAt: { type: Date },
	resetPasswordToken: String,
	resetPasswordExpires: Date,
});

MongooseAutoIncrementID.initialise('counters');

userSchema.plugin(MongooseAutoIncrementID.plugin, {
	modelName: 'User',
	field: 'user',
	incrementBy: 1,
	startAt: 1,
	unique: true,
	nextCount: false,
	resetCount: false,
});
userSchema.plugin(immutablePlugin);

userSchema.virtual('fullName').get(() => {
	if (this.firstName && this.lastName) return `${this.firstName} ${this.lastName}`;
	if (this.firstName && !this.lastName) return this.firstName;
	if (!this.firstName && this.lastName) return this.lastName;
	return undefined;
});
userSchema.virtual('initials').get(() => (this.firstName && this.lastName && `${this.firstName[0].concat(this.lastName[0]).toUpperCase()}`));

userSchema.methods.validPassword = function validPassword(password) {
	return bcrypt.compareSync(password, this.password);
};

userSchema.methods.validEmail = function validEmail(email) {
	return email === this.email;
};

userSchema.methods.hashPassword = function hashPassword() {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(10, (err1, salt) => {
			if (err1) { reject(err1); }
			bcrypt.hash(this.password, salt, (err2, hash) => {
				if (err2) { reject(err2); }
				this.password = hash;
				resolve(hash);
			});
		});
	});
};
userSchema.methods.hidePassword = function hidePassword() {
	return R.omit(['password', '__v', '_id'], this.toObject({ virtuals: true }));
};

const User = mongoose.model('User', userSchema);

module.exports = User;
