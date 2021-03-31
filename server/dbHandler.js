const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const { MongoMemoryServer } = require('mongodb-memory-server');
const { mongoURI } = require('../config.js');

const mongod = new MongoMemoryServer();

/**
 * Connect to MongoMemoryServer db if testing, else connect to production db
 */
module.exports.connect = async () => {
  const mongooseOpts = {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  let activeURI;

  if (process.env.NODE_ENV === 'test') {
    const testDbURI = await mongod.getUri();
    activeURI = testDbURI;
  } else {
    activeURI = mongoURI;
  }

  await mongoose.connect(activeURI, mongooseOpts);
};

/**
 * Used only for test db. Removes all documents from all collections in db
 */
module.exports.clearDatabase = async () => {
  if (process.env.NODE_ENV === 'test') {
    const { collections } = mongoose.connection;
    const results = [];

    Object.values(collections).forEach((collection) => {
      results.push(collection.deleteMany());
    });

    await Promise.all(results);
  }
};

/**
 * Used only for test db. Drop db, close the connection, and stop mongod
 */
module.exports.closeDatabase = async () => {
  if (process.env.NODE_ENV === 'test') {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
  }
};
