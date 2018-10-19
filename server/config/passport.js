require('dotenv').load();
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const uuid = require('uuid');
const mongoose = require('mongoose');

const Strategies = require('./strategies');
const { User } = require('../models');

module.exports = (app) => {
	const sessionConfig = {
		store: new MongoStore({
			mongooseConnection: mongoose.connection,
			collection: 'sessions',
			uri: process.env.DATABASE_URL,
		}),
		genid: () => uuid.v4(),
		cookie: { secure: false },
		secret: 'bdms-secret',
		resave: false,
		saveUninitialized: false,
	};

	app.use(session(sessionConfig));
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((user, done) => done(null, user.id));

	passport.deserializeUser((id, done) => User.findById({ _id: id })
		.then(user => done(null, user))
		.catch(err => console.warn(`err at deserialize: ${err}`)));

	passport.use(Strategies.local);
};
