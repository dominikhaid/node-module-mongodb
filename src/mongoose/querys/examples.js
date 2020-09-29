const mongoose = require("mongoose");
const con = require("./db/db");
const utils = require("./functions/utils");
const querys = require("./querys/querys");

async function findOne(data) {
	let queryRes = await querys.findOne(data);

	console.log(queryRes);

	return { msg: "success", saved: queryRes };
}

async function searchOne(data) {
	let queryRes = await querys.searchOne(data);

	console.log(queryRes);

	return { msg: "success", saved: queryRes };
}

async function deleteOne(data) {
	let queryRes = await querys.deleteOne(data);

	console.log("RETURN", queryRes);

	return { msg: "success", saved: queryRes };
}

async function updateOne(condition, data) {
	let queryRes = await querys.updateOne(condition, data);

	console.log("RETURN", queryRes);

	return { msg: "success", saved: queryRes };
}

async function createOne(data) {
	let queryRes = await querys.createOne(data);

	console.log("CREQATED", queryRes);
	return { msg: "success", saved: queryRes };
}

/**
 *
 * Validations
 */
async function validate(db) {
	/**
	 * SAmple
	 */
	var schema = new Schema({
		name: {
			type: String,
			required: true,
		},
	});
	var Cat = db.model("Cat", schema);

	// This cat has no name :(
	var cat = new Cat();
	cat.save(function (error) {
		assert.equal(error.errors["name"].message, "Path `name` is required.");
		if (error) console.log("Path `name` is required.");
		error = cat.validateSync();
		assert.equal(error.errors["name"].message, "Path `name` is required.");
	});
	/**
	 * SAmple
	 */
	var breakfastSchema = new Schema({
		eggs: {
			type: Number,
			min: [6, "Too few eggs"],
			max: 12,
		},
		bacon: {
			type: Number,
			required: [true, "Why no bacon?"],
		},
		drink: {
			type: String,
			enum: ["Coffee", "Tea"],
			required: function () {
				return this.bacon > 3;
			},
		},
	});

	var Breakfast = db.model("Breakfast", breakfastSchema);

	var badBreakfast = new Breakfast({
		eggs: 2,
		bacon: 0,
		drink: "Milk",
	});
	var error = badBreakfast.validateSync();
	assert.equal(error.errors["eggs"].message, "Too few eggs");
	assert.ok(!error.errors["bacon"]);
	assert.equal(
		error.errors["drink"].message,
		"`Milk` is not a valid enum value for path `drink`."
	);

	badBreakfast.bacon = 5;
	badBreakfast.drink = null;

	error = badBreakfast.validateSync();
	assert.equal(error.errors["drink"].message, "Path `drink` is required.");

	badBreakfast.bacon = null;
	error = badBreakfast.validateSync();
	assert.equal(error.errors["bacon"].message, "Why no bacon?");

	/**
	 * SAmple
	 */
	const uniqueUsernameSchema = new Schema({
		username: {
			type: String,
			unique: true,
		},
	});
	const U1 = db.model("U1", uniqueUsernameSchema);
	const U2 = db.model("U2", uniqueUsernameSchema);

	const dup = [{ username: "Val" }, { username: "Val" }];

	U2.create(dup, (err) => {
		if (err) console.log(err);
		// Race condition! This may save successfully, depending on whether
		// MongoDB built the index before writing the 2 docs.
	});

	// You need to wait for Mongoose to finish building the `unique`
	// index before writing. You only need to build indexes once for
	// a given collection, so you normally don't need to do this
	// in production. But, if you drop the database between tests,
	// you will need to use `init()` to wait for the index build to finish.
	// U2.init()
	//   .then(() => U2.create(dup))
	//   .catch((error) => {
	//     if (error) console.log(error)
	//     // Will error, but will *not* be a mongoose validation error, it will be
	//     // a duplicate key error.
	//     // See: https://masteringjs.io/tutorials/mongoose/e11000-duplicate-key
	//     assert.ok(error)
	//     assert.ok(!error.errors)
	//     assert.ok(error.message.indexOf('duplicate key error') !== -1)
	//   })

	/**
	 * Sample
	 */
	var userSchema = new Schema({
		phone: {
			type: String,
			validate: {
				validator: function (v) {
					return /\d{3}-\d{3}-\d{4}/.test(v);
				},
				message: (props) => `${props.value} is not a valid phone number!`,
			},
			required: [true, "User phone number required"],
		},
	});

	var User = db.model("user", userSchema);
	var user = new User();
	var error;

	user.phone = "555.0123";
	error = user.validateSync();
	assert.equal(
		error.errors["phone"].message,
		"555.0123 is not a valid phone number!"
	);

	user.phone = "";
	error = user.validateSync();
	assert.equal(error.errors["phone"].message, "User phone number required");

	user.phone = "201-555-0123";
	// Validation succeeds! Phone number is defined
	// and fits `DDD-DDD-DDDD`
	error = user.validateSync();
	assert.equal(error, null);

	/**
	 * Sample
	 */
	const vehicleSchema = new mongoose.Schema({
		numWheels: { type: Number, max: 18 },
	});
	const Vehicle = db.model("Vehicle", vehicleSchema);

	const doc = new Vehicle({ numWheels: "not a number" });
	const err = doc.validateSync();

	err.errors["numWheels"].name; // 'CastError'
	// 'Cast to Number failed for value "not a number" at path "numWheels"'
	err.errors["numWheels"].message;
}

/**
 * SubDocuments
 */

async function subdocuments(db) {
	var childSchema = new Schema({
		name: "string",
	});

	var parentSchema = new Schema({
		// Array of subdocuments
		children: [childSchema],
		// Single nested subdocuments. Caveat: single nested subdocs only work
		// in mongoose >= 4.2.0
		child: childSchema,
	});

	childSchema.pre("save", function (next) {
		if ("invalid" == this.name) {
			return next(new Error("#sadpanda"));
		}
		next();
	});

	var Parent = db.model("Parent", parentSchema);

	var parent = new Parent();
	// create a comment
	parent.children.push({ name: "Liesl" });
	var subdoc = parent.children[0];
	console.log(subdoc); // { _id: '501d86090d371bab2c0341c5', name: 'Liesl' }
	subdoc.isNew; // true

	// parent.save(function (err) {
	//   if (err) return handleError(err)
	//   console.log('Success!')
	// })

	var doc = parent.children.id(subdoc.id);
	console.log(doc.parent());
	parent.children.push(subdoc);
	console.log(doc.parent());
	parent.children.id(subdoc.id).remove();
	console.log(doc.parent());
}

// updateOne({ name: "LOL STORY"},data)
//  deleteOne(data)
// findOne(data)
// searchOne(data);
// createOne(data);
