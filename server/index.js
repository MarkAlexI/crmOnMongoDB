let db = require('./db/conn.js');
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let http = require('http').Server(app);

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

app.set('port', process.env.PORT || 5000);
http.listen(app.get('port'), function() {
    console.log('listening on port', app.get('port'));
});

app.post('/create', async function (req, res, next) {
  let customer = { name: req.body.name, address: req.body.address, telephone: req.body.telephone, note: req.body.note };
  const result = await db.collection("customers").insertOne(customer);
  console.log(JSON.stringify(result.insertedId));

  res.send('Customer created');
});