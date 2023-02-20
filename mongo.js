const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
// Remove dep warning

const dbclient = new MongoClient(process.env.DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
dbclient.connect()
// const dbTwo = mongoose.createConnection(process.env.DB_PATH2, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = { dbclient }