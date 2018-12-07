const R = require('ramda');
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');
const uuid = require('uuid/v4');

const projectSchema = new mongoose.Schema({
	organization: { type: mongoose.Schema.ObjectId, ref: 'Organization', required: true },
	title: { type: String },
	createdAt: { type: Date, default: Date.now, immutable: true },
	updatedAt: { type: Date },
	projectId: { type: String, default: uuid, immutable: true, unique: true },
	readKey: { type: String, default: uuid, immutable: true },
	writeKey: { type: String, default: uuid, immutable: true },
	masterKey: { type: String, default: uuid, immutable: true },
});

projectSchema.plugin(immutablePlugin);
projectSchema.methods.hide = function hide() {
	return R.omit(['__v', '_id'], this.toObject());
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
