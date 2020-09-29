/**
 *
 * @param {Object} db mongoDB database
 * @param {String} name collection name
 */

module.exports.findCollections = (db, name) =>
	db
		.listCollections(name ? { name: name } : null, { nameOnly: true })
		.toArray();

/**
 *
 * @param {Object} db mongoDB database
 * @param {String} name collection name
 */

module.exports.createCollection = (db, name) =>
	db.createCollection(name, {
		capped: false,
	});
