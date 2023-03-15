let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let http = require('http').Server(app);

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

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile('/app/index.html', {root:'.'});
});

app.get('/assets/index.css', function (req, res) {
  res.sendFile('/app/assets/index.css', {root:'.'});
});

app.get('/create', function (req, res) {
  res.sendFile('/app/create.html', {root:'.'});
});

app.get('/create/assets/create.css', function (req, res) {
  res.sendFile('/app/assets/create.css', {root:'.'});
});

app.get('/records', function (req, res) {
  res.send('Check');
});

app.set('port', process.env.PORT || 5000);
http.listen(app.get('port'), function() {
    console.log('listening on port', app.get('port'));
});

app.post('/create', async function (req, res, next) {
  let customer = { name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note };
  const result = await db.collection("customers").insertOne(customer);
  console.log(JSON.stringify(result.insertedId));
  res.redirect('/');
});