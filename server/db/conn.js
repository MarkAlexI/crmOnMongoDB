const { MongoClient, ServerApiVersion } = require('mongodb');
const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;

const uri = `mongodb+srv://${mongo_username}:${mongo_password}@crm.5vvsy1k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

let conn, db;

async function getDb() {
  try {
    conn = await client.connect();
  } catch(e) {
    console.error(e);
  }

  db = conn.db("crmdb");
}

getDb();

module.export = db;