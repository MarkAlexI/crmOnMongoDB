let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let http = require('http').Server(app);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views", "./app/views");
app.disable("x-powered-by");

app.get('/', function (req, res) {
  res.sendFile('/app/index.html', {root:'.'});
});

app.get('/assets/index.css', function (req, res) {
  res.sendFile('/app/assets/index.css', {root:'.'});
});

app.get('/create', function (req, res) {
  res.sendFile('/app/create.html', {root:'.'});
});

app.get('/records', async function (req, res) {
  const result = await getRecords();
  res.render("records.hbs", {
    recordsVisible: result?.length > 0,
    records: result
  });
});

app.set('port', process.env.PORT || 5000);
http.listen(app.get('port'), function() {
  console.log('listening on port', app.get('port'));
});

app.post('/create', async function (req, res) {
  let customer = { name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note };
  const result = await db.collection("customers").insertOne(customer);
  console.log(JSON.stringify(result.insertedId));
  res.redirect('/');
});

app.delete('/records/:id', async (req, res) => {
 /* const id = req.params.id;
  console.log(id);
  res.redirect(`/`);*/
  /*try {
  const id = req.params.id;//new objectId(req.params.id);
        const user = await db.collection("customers").findOne({_id: id});
        if(user) res.send(user);
        else res.sendStatus(404);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
}*/
let collection = await db.collection("customers");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) {
    console.log(`not`);
    res.send("Not found").status(404);
  } else {
    console.log(JSON.stringify(result));
    res.send(JSON.stringify(result)).status(200);
  }
});

app.get('/get', function (req, res) {
  res.sendFile('/app/get.html', {root:'.'});
});

app.get('/get-client', async function (req, res) {
  try {
    /*db.collection("customers").findOne({name: req.query.name}, function(err, result) {
      if (err) throw err;
      res.render("update.hbs", {
        oldname: result.name,
        oldaddress: result.address,
        oldtelephone: result.telephone,
        oldnote: result.note,
        name: result.name,
        address: result.address,
        telephone: result.telephone,
        note: result.note
      });
    });*/
    const id = new ObjectId(req.params.id);
        const user = await db.collection("customers").findOne({_id: id});
        if(user) (console.log(user), res.send(user));
        else res.sendStatus(404);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});

async function getRecords() {
  try {
    const result = await db.collection("customers")
      .find({})
      .limit(100)
      .toArray();
    return result;
  } catch(err) {
    console.log(err);
  } finally {
    console.log(Date.now());
  }
}

process.on("SIGINT", async() => {
  await client.close();
  console.log("Application ended work");
  process.exit();
});