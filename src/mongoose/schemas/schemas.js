const mongoose = require("mongoose");

const Schema = mongoose.Schema;

module.exports.Schema = Schema;

/**
 * PERSONS
 * populate Stories
 */
module.exports.people = Schema({
	_id: Schema.Types.ObjectId,
	name: { type: String, index: true, unique: true, required: true },
	age: Number,
	stories: [
		{
			type: Schema.Types.ObjectId,
			ref: "Story",
		},
	],
	fans: [
		{
			type: Schema.Types.ObjectId,
			ref: "Fan",
		},
	],
	createdAt: { type: Date, default: Date.now },
});

/**
 * STORYS
 * Referenced by people populate Fans and Author
 */
module.exports.stories = Schema({
	_id: Schema.Types.ObjectId,
	author: {
		type: Schema.Types.ObjectId || null,
		default: null,
		ref: "Person",
	},
	title: { type: String, required: true, unique: true },
	fans: [
		{
			type: Schema.Types.ObjectId,
			ref: "Fan",
		},
	],
	createdAt: { type: Date, default: Date.now },
});

/**
 * FANS
 * Referenced by Stories
 */
module.exports.fans = Schema({
	_id: Schema.Types.ObjectId,
	name: { type: String },
	email: {
		type: String,
		lowercase: true,
		index: true,
		unique: true,
		required: true,
		validate: {
			validator: function (v) {
				return /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim.test(v);
			},
			message: (props) => `${props.value} is not a validd E-mail adresss`,
		},
	},
	author: [
		{
			type: Schema.Types.ObjectId,
			ref: "Person",
		},
	],
	stories: [
		{
			type: Schema.Types.ObjectId,
			ref: "Story",
		},
	],
	createdAt: { type: Date, default: Date.now },
});

/**
 *
 * @param {Object} db
 * @param {Object} model
 * @param {string} name
 */
module.exports.createSchema = (db, model, name) => {
	const MyModel = db.model(name, model);
	const m = new MyModel();
	m.save();
};
