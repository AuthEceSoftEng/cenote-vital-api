const R = require('ramda');
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');

const todoSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
	text: { type: String },
	completed: { type: Boolean, default: false },
	created_at: { type: Date, default: Date.now, immutable: true },
	updated_at: { type: Date },
});

todoSchema.plugin(immutablePlugin);
todoSchema.methods.hide = function hide() {
	return R.omit(['__v'], this.toObject());
};

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;
