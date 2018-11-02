const R = require('ramda');
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');
const uuid = require('uuid/v4');

const projectSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
	text: { type: String },
	completed: { type: Boolean, default: false },
	created_at: { type: Date, default: Date.now, immutable: true },
	updated_at: { type: Date },
	project_id: { type: String, default: uuid(), immutable: true },
});

projectSchema.plugin(immutablePlugin);
projectSchema.methods.hide = function hide() {
	return R.omit(['__v', '_id'], this.toObject());
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
