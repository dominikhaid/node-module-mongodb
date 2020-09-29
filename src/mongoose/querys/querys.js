const mongoose = require("mongoose");
const assert = require("assert");

/**
 *
 *Find all Documents
 *
 */
module.exports.find = (con, data) => {
	let res = new Object();

	if (data === "person") {
		res = con.models.Person.find()
			.populate("fans", "name email")
			.populate("stories", "title")
			.exec();
	} else if (data === "stories") {
		res = con.models.Story.find()
			.populate("fans", "name email")
			.populate("author", "name age")
			.exec();
	} else if (data === "fans") {
		res = con.models.Fan.find()
			.populate("stories", "title")
			.populate("author", "name age")
			.exec();
	}

	return res;
};

/**
 * CREATE PERsON
 */

module.exports.createOne = (con, data) => {
	let tempRes = new Object();
	let author, story, fan;
	let loopArray = [];
	const Fan = con.models.Fan;
	const Story = con.models.Story;
	const Person = con.models.Person;

	function prepareData() {
		//prepare person obj
		if (data.person) {
			if (data.story) data.person.stories = data.story._id;
			if (data.fan) data.person.fans = data.fan._id;
			author = new Person({
				_id: mongoose.Types.ObjectId(),
				...data.person,
			});

			loopArray.push({
				model: author,
				save: (a) => {
					tempRes.author = a;
				},
			});
		}

		//prepare story obj
		if (data.story) {
			if (data.person) data.story.author = data.person._id;
			if (data.fan) data.story.fans = data.fan._id;
			story = new Story({
				_id: mongoose.Types.ObjectId(),
				...data.story,
			});
			loopArray.push({
				model: story,
				save: (a) => {
					tempRes.story = a;
				},
			});
		}
		//prepare fan obj
		if (data.fan) {
			if (data.story) data.fan.stories = data.story._id;
			if (data.person) data.fan.author = data.person._id;
			fan = new Fan({
				_id: mongoose.Types.ObjectId(),
				...data.fan,
			});
			loopArray.push({
				model: fan,
				save: (a) => {
					tempRes.fan = a;
				},
			});
		}

		let x = loopArray.length - 1;
		return writeData(x);
	}

	function writeData(x) {
		if (x >= 0) {
			return (res = loopArray[x].model.save().then((e) => {
				loopArray[x].save(e);
				x--;
				return writeData(x);
			})).catch((err) => {
				if (err.code === 11000)
					return {
						error: 10,
						msg: `duplicated unique index ${JSON.stringify(
							err.keyValue
						)}  already exsits`,
					};
				return { error: 10, msg: err };
			});
		} else {
			return tempRes;
		}
	}
	return prepareData();
};

/**
 * READ PERSON
 */

module.exports.findOne = (con, data) => {
	let res = new Object();

	if (data.person) {
		res = con.models.Person.findById(data.person._id, "name age")
			.populate("fans", "name email")
			.populate("stories", "title")
			.exec();
	} else if (data.story) {
		res = con.models.Story.findById(data.story._id, "title")
			.populate("fans", "name email")
			.populate("author", "name age")
			.exec();
	} else if (data.fan) {
		res = con.models.Fan.findById(data.fan._id, "name email")
			.populate("stories", "title")
			.populate("author", "name age")
			.exec();
	}

	return res;
};

/**
 *SEARCH
 */
module.exports.searchOne = (con, data) => {
	let res = new Object();

	if (data.person) {
		res = con.models.Person.findOne({ name: data.person.name }, "name age")
			.populate("fans", "name email")
			.populate("stories", "title")
			.exec();
	} else if (data.story) {
		res = con.models.Story.findOne({ title: data.story.title }, "title")
			.populate("fans", "name email")
			.populate("author", "name age")
			.exec();
	} else if (data.fan) {
		res = con.models.Fan.findOne({ email: data.fan.email }, "name email")
			.populate("stories", "title")
			.populate("author", "name age")
			.exec();
	}

	return res;
};

/**
 * UPDATE PERSON
 */
module.exports.updateOne = async function (con, condition, data) {
	let updateRes;

	if (data.person) {
		let personRes = await con.models.Person.findOneAndUpdate(
			condition,
			data.person
		).catch((err) => {
			if (err.code === 11000)
				return {
					error: 10,
					msg: `duplicated unique index ${JSON.stringify(
						err.keyValue
					)}  already exsits`,
				};
			return { error: 10, msg: err };
		});
		if (personRes && personRes.error) return personRes;
		if (personRes)
			updateRes = await con.models.Person.findOne({ ...data.person }).catch(
				(err) => {
					return { error: 10, msg: err };
				}
			);
		return personRes
			? updateRes
			: { error: 30, msg: "No matching person found" };
	} else if (data.story) {
		let storyRes = await con.models.Story.findOneAndUpdate(
			condition,
			data.story
		).catch((err) => {
			if (err.code === 11000)
				return {
					error: 10,
					msg: `duplicated unique index ${JSON.stringify(
						err.keyValue
					)}  already exsits`,
				};
			return { error: 10, msg: err };
		});
		if (storyRes && storyRes.error) return storyRes;
		if (storyRes) updateRes = await con.models.Story.findOne({ ...data.story });
		return storyRes ? updateRes : { error: 30, msg: "No matching story found" };
	} else if (data.fan) {
		let fanRes = await con.models.Fan.findOneAndUpdate(
			condition,
			data.fan
		).catch((err) => {
			if (err.code === 11000)
				return {
					error: 10,
					msg: `duplicated unique index ${JSON.stringify(
						err.keyValue
					)}  already exsits`,
				};
			return { error: 10, msg: err };
		});

		if (fanRes && fanRes.error) return fanRes;
		if (fanRes) updateRes = await con.models.Fan.findOne({ ...data.fan });
		return fanRes ? updateRes : { error: 30, msg: "No matching fan found" };
	}
};

/**
 *DELTE PERSON
 */

module.exports.deleteOne = async function (con, data) {


	async function updateAuthorRealated(res) {

		let stroyUpdate, fanUpate;

		if (res.stories.length > 0)
			stroyUpdate = await con.models.Story.updateMany({
				$set: { author: null },
			});

		if (res.fans.length > 0)
			fanUpate = await con.models.Fan.updateMany({
				$pull: { author: res._id },
			});

		return { updated: { stroies: stroyUpdate, fans: fanUpate } };
	}

	async function updateStoryRelated(res) {
		let authorUpdate, fanUpdate;

		if (res.fans.length > 0)
			fanUpdate = await con.models.Fan.updateMany({
				$pull: { stories: res._id },
			});

		if (res.author)
			authorUpdate = await con.models.Person.updateMany({
				$pull: { stories: res._id },
			});

		return { updated: { Persons: authorUpdate, fans: fanUpdate } };
	}

	async function updateFanRelated(res) {
		let authorUpdate, storiesUpdate;

		if (res.stories.length > 0)
			storiesUpdate = await con.models.Story.updateMany({
				$pull: { fans: res._id },
			});

		if (res.author.length > 0)
			authorUpdate = await con.models.Person.updateMany({
				$pull: { fans: res._id },
			});

		return { updated: { Persons: authorUpdate, stories: storiesUpdate } };
	}


	if (data.person) {
		let personRes = await con.models.Person.findOneAndDelete({
			name: data.person.name,
		});
		let updateRes;

		if (
			(personRes && personRes.stories && personRes.stories.length > 0) ||
			(personRes && personRes.fans && personRes.fans.length > 0)
		) {
			updateRes = await updateAuthorRealated(personRes);
			return (updateRes = [personRes, updateRes]);
		} else {
			return { error: 5, msg: "No User Found" };
		}
	} else if (data.story) {

		let storyRes = await con.models.Story.findOneAndDelete({
			title: data.story.title,
		});
		let updateRes;
     console.log(storyRes)
		if (
			(storyRes && storyRes.author) ||
			(storyRes && storyRes.fans && storyRes.fans.length > 0)
		) {
			updateRes = await updateStoryRelated(storyRes);
			return (updateRes = [storyRes, updateRes]);
		} else {
			return { error: 5, msg: "No Stroy Found" };
		}
	} else if (data.fan) {
		let fanRes = await con.models.Fan.findOneAndDelete({
			email: data.fan.email,
		});
		let updateRes;

		if (
			(fanRes && fanRes.stories && fanRes.stories.length > 0) ||
			(fanRes && fanRes.author && fanRes.author.length > 0)
		) {
			updateRes = await updateFanRelated(fanRes);
			return (updateRes = [fanRes, updateRes]);
		} else {
			return { error: 5, msg: "No Fan Found" };
		}
	}
};
