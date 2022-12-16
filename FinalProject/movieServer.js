process.stdin.setEncoding('utf8');

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const searchHandler = require('./searchHandler');
const databaseHandler = require('./databaseHandler');

const app = express();
const portNumber = 4444;

app.listen(portNumber);
console.log(`Web server running at http://localhost:${portNumber}`);

/* directory where templates will reside */
app.set('views', path.resolve(__dirname, 'templates'));

/* view/templating engine */
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/css', express.static(__dirname + '/css'));

app.get('/', function (request, response) {
  response.render('index');
});

app.post('/processResult', async function (request, response) {
  const { searchVal, opts } = request.body;
  await databaseHandler.client.db(process.env.MONGO_DB_NAME).collection(process.env.MONGO_COLLECTION).insertOne({val: searchVal});
  const config = await searchHandler.configuration();
  const result = await searchHandler.search(searchVal, opts);

  variable = {
    img: config.base_url+config.size+result.img,
    title: result.title,
    overview: result.overview,
    avgRating: result.avgRating
  }
  response.render("result", variable);
});
