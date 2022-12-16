const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, 'credentials/.env'),
});

const database = {
  user: process.env.MONGO_DB_USERNAME,
  password: process.env.MONGO_DB_PASSWORD,
  db: process.env.MONGO_DB_NAME,
  collection: process.env.MONGO_DB_COLLECTION,
};

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${user}:${pass}@cluster0.pz8inny.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect();

// TODO: access MongoDB and export methods to movieServer.js
