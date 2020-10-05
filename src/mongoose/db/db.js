const mongoose = require('mongoose');
const utils = require('../functions/utils');

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
  configDb = require('../../../config/mongo-config.json');
} catch (error) {
  console.log(error);
}

if (process.env.NODE_ENV === 'development') {
  configDb = configDb.development;
} else if (process.env.NODE_ENV === 'production') {
  configDb = configDb.production;
} else {
  configDb = configDb.test;
}

/**
 * MAKE CONNECTION AND REGISTER MODELS
 */

module.exports = function connectionFactory() {
  const con = mongoose.createConnection(configDb.host, options);

  const Stroy = con.model('Story', require('../schemas/schemas').stories);
  const Person = con.model('Person', require('../schemas/schemas').people);
  const Fan = con.model('Fan', require('../schemas/schemas').fans);

  con.on('error', error => {
    console.error.bind(console, 'connection error:');
    con.close();
    console.log(error);
    return error;
  });

  con.once('open', function () {
    console.info(`
				_________________

				MongoDB Connected
				_________________`);

    async function initCollections() {
      let collections = await utils
        .findCollections(con.db)
        .then(coll => {
          console.info(`
				_________________

				CHECK COLLECTIONS
				_________________`);
          return coll;
        })
        .catch(err => {
          return err;
        });

      if (!collections[0] || typeof collections[0] !== 'object')
        collections.push({name: 'fans', items: 0});
      if (!collections[1] || typeof collections[1] !== 'object')
        collections.push({name: 'persons', items: 0});
      if (!collections[2] || typeof collections[2] !== 'object')
        collections.push({name: 'story', items: 0});

      if (!collections[1].items)
        collections[1].items = await Person.estimatedDocumentCount();

      if (!collections[2].items)
        collections[2].items = await Stroy.estimatedDocumentCount();

      if (!collections[0].items)
        collections[0].items = await Fan.estimatedDocumentCount();

      console.info(`
				_________________

				Authors: ${collections[1].items}
				Fans: ${collections[0].items}
				Stories: ${collections[2].items}
				_________________`);

      return collections;
    }

    async function insertData(collections) {
      if (!collections[0].items > 0) {
        try {
          collections[0].data = require('../../../data/mongoose-fans.json');
        } catch (error) {
          console.log(error);
        }
      }
      if (!collections[2].items > 0) {
        try {
          collections[2].data = require('../../../data/mongoose-stories.json');
        } catch (error) {
          console.log(error);
        }
      }
      if (!collections[1].items > 0) {
        try {
          collections[1].data = require('../../../data/mongoose-author.json');
        } catch (error) {
          console.log(error);
        }
      }

      let maxCount = [];
      collections.forEach(items => {
        if (items.data > maxCount) maxCount = items.data;
      });

      maxCount.forEach((element, index) => {
        let fanId = mongoose.Types.ObjectId();
        let personId = mongoose.Types.ObjectId();
        let storiesId = mongoose.Types.ObjectId();

        if (collections[2].data && collections[2].data[index]) {
          collections[2].data[index]._id = storiesId;
          collections[2].data[index].stories = [storiesId];
          collections[2].data[index].author = personId;
        }

        if (collections[0].data && collections[0].data[index]) {
          collections[0].data[index]._id = fanId;
          collections[0].data[index].stories = [storiesId];
          collections[0].data[index].author = [personId];
        }

        if (collections[1].data && collections[1].data[index]) {
          collections[1].data[index]._id = personId;
          collections[1].data[index].fans = [fanId];
          collections[1].data[index].stories = [storiesId];
        }
      });

      if (collections[1].data) {
        await con.models.Person.insertMany(collections[1].data)
          .then(() => {
            console.info(`
				_________________________
				INSERTED PEOPLE
				DOCUMENTS: ${collections[1].data.length}
				_________________________`);
          })
          .catch(error => {
            console.log(error);
          });
      }

      if (collections[0].data) {
        await con.models.Fan.insertMany(collections[0].data)
          .then(() => {
            console.info(`
				_________________________
				INSERTED FANS
				DOCUMENTS: ${collections[0].data.length}
				_________________________`);
          })
          .catch(error => {
            console.log(error);
          });
      }
      if (collections[1].data) {
        await con.models.Story.insertMany(collections[2].data)
          .then(() => {
            console.info(`
				_________________________
				INSERTED STORIES
				DOCUMENTS: ${collections[2].data.length}
				_________________________`);
          })
          .catch(error => {
            console.log(error);
          });
      }
    }

    initCollections().then(collections => {
      if (
        collections[0].items > 0 &&
        collections[1].items > 0 &&
        collections[2].items > 0
      )
        return true;
      insertData(collections);
    });
  });

  con.on('close', msg => {
    console.info.bind(console, 'connection info:');
    console.info(`
				_________________

				  Disconnected
				_________________`);
  });

  return con;
};
