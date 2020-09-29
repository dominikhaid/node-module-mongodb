const mongoose = require("mongoose");
const utils = require("../functions/utils");

/**
 * READ CONNECTION OTIONS FROM ./contig/CONFIG.JSON
 */
const options = {
	useNewUrlParser: true,
	useCreateIndex: true,
	autoIndex: true, //this is the code I added that solved it all
	keepAlive: true,
	poolSize: 10,
	bufferMaxEntries: 0,
	connectTimeoutMS: 10000,
	socketTimeoutMS: 45000,
	family: 4, // Use IPv4, skip trying IPv6
	useFindAndModify: false,
	useUnifiedTopology: true,
};

let configDb;
try {
	configDb = require("../../../config/mongo-config.json");
} catch (error) {
	console.log(error);
}

if (process.env.NODE_ENV === "development") {
	configDb = configDb.development;
} else if (process.env.NODE_ENV === "production") {
	configDb = configDb.production;
} else {
	configDb = configDb.test;
}

/**
 * MAKE CONNECTION AND REGISTER MODELS
 */

module.exports = function connectionFactory() {
	const con = mongoose.createConnection(configDb.host, options);

	con.model("Story", require("../schemas/schemas").stories);
	con.model("Person", require("../schemas/schemas").people);
	con.model("Fan", require("../schemas/schemas").fans);

	con.on("error", (error) => {
		console.error.bind(console, "connection error:");
		con.close();
		return error;
	});

	con.once("open", function () {
		console.info(`
				_________________

				MongoDB Connected
				_________________`);

		async function initCollections() {
			let collections = await utils.findCollections(con.db);
			console.info(`
				_________________

				CHECK COLLECTIONS
				_________________`);

			let fans = collections.findIndex((el) => el.name === "fans");
			if (fans === -1) {
				utils.createCollection(con.db, "fans");
				console.info(`
				______________________

				CREATED FAN COLLECTION
				______________________`);
			}
			let stroys = collections.findIndex((el) => el.name === "stories");
			if (stroys === -1) {
				utils.createCollection(con.db, "stories");
				console.info(`
				__________________________

				CREATED STORIES COLLECTION
				__________________________`);
			}

			let people = collections.findIndex((el) => el.name === "people");
			if (people === -1) {
				console.info(`
				_________________________

				CREATED PEOPLE COLLECTION
				_________________________`);
				utils.createCollection(con.db, "people");


			}
		}
				async function insertData() {
					let data = {
					person: {},
					fan: {},
					stories: {},
				};

				try {
					data.fan = require("../../../data/mongoose-fans.json");
				} catch (error) {
					console.log(error);
				}

				try {
					data.stories = require("../../../data/mongoose-stories.json");
				} catch (error) {
					console.log(error);
				}

				try {
					data.person = require("../../../data/mongoose-author.json");
				} catch (error) {
					console.log(error);
				}


					data.fan.forEach((element, index) => {
						let fanId = mongoose.Types.ObjectId();
						let personId = mongoose.Types.ObjectId();
						let storiesId = mongoose.Types.ObjectId();

						data.fan[index]._id = fanId;
						data.stories[index]._id = storiesId;
						data.person[index]._id = personId;

						data.fan[index].stories = [storiesId];
						data.fan[index].author = [personId];

						data.stories[index].stories = [storiesId];
						data.stories[index].author = personId;

						data.person[index].fans = [fanId];
						data.person[index].stories = [storiesId];
					});

					let erg = await con.models.Person.insertMany(data.person);
					erg = await con.models.Fan.insertMany(data.fan);
					erg = await con.models.Story.insertMany(data.stories);

					console.info(`
				_________________

				  Data inserted
				_________________`);
				}


		initCollections().then(e => insertData());
	});

	con.on("close", (msg) => {
		console.info.bind(console, "connection info:");
		console.info(`
				_________________

				  Disconnected
				_________________`);
	});

	return con;
};

// const	con = mongoose.createConnection(configDb.host, options)

// con.on("error", error => {
// 	console.error.bind(console, "connection error:")
// 	console.log(error)
// 	con.close()
// 	return error
// });

// con.once("open", function () {
// 	console.info(`
// 		_________________

// 		MongoDB Connected
// 		_________________`)

// 	async function initCollections() {
// 		let collections = await utils.findCollections(con.db);
// 		console.info(`
// 		_________________

// 		CHECK COLLECTIONS
// 		_________________`)

// 		let fans = collections.findIndex((el) => el.name === "fans");
// 		if (fans === -1) {
// 			utils.createCollection(con.db, "fans");
// 			console.info(`
// 		______________________

// 		CREATED FAN COLLECTION
// 		______________________`)
// 		}
// 		let stroys = collections.findIndex((el) => el.name === "stories");
// 		if (stroys === -1) {
// 			utils.createCollection(con.db, "stories");
// 			console.info(`
// 		__________________________

// 		CREATED STORIES COLLECTION
// 		__________________________`)
// 		}

// 		let people = collections.findIndex((el) => el.name === "people");
// 		if (people === -1) {
// 			console.info(`
// 		_________________________

// 		CREATED PEOPLE COOLECTION
// 		_________________________`)
// 			utils.createCollection(con.db, "people");
// 		}
// 	}

// 	initCollections()

// 	// let data = {
// 	// 	person: { _id: new mongoose.Types.ObjectId(), name: "lol", age: 10 },
// 	// 	story: { _id: new mongoose.Types.ObjectId(), title: "LOL STORY" },
// 	// 	fan: {
// 	// 		_id: new mongoose.Types.ObjectId(),
// 	// 		name: "LOL STORY",
// 	// 		email: "LOL@LOL.lol",
// 	// 	},
// 	// };

// });

// module.exports.con = con

// const Stroy =  con.model("Story", require("../schemas/schemas").stories);
// module.exports.Story = Stroy

// const Person = con.model("Person", require("../schemas/schemas").people);
// module.exports.Person = Person

// const Fan = con.model("Fan", require("../schemas/schemas").fans);
// module.exports.Fan = Fan
