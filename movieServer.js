const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const searchHandler = require('./searchHandler');
const databaseHandler = require('./databaseHandler');

process.stdin.setEncoding('utf8');

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

app.post('/result', async function (request, response) {
  const { searchVal, opts } = request.body;

  try {
    await databaseHandler.client.connect();
    await databaseHandler.client
      .db(process.env.MONGO_DB_NAME)
      .collection(process.env.MONGO_COLLECTION)
      .insertOne({ val: searchVal });
  } catch (error) {
    console.error(error);
  } finally {
    await databaseHandler.client.close();
  }

  const config = await searchHandler.configuration();
  const result = await searchHandler.search(searchVal, opts);

  variable = {
    img: config.base_url + config.size + result.img,
    title: result.title,
    overview: result.overview,
    avgRating: result.avgRating,
  };

  response.render('result', variable);
});

app.post('/recent_searches', async (request, response) => {
  let html = '';
  let text = '';

  try {
    await databaseHandler.client.connect();
    const result = await databaseHandler.client
      .db(process.env.MONGO_DB_NAME)
      .collection(process.env.MONGO_COLLECTION)
      .find()
      .toArray();

    if (result && result.length != 0) {
      html += '<table><tr><th>Searches</th></tr>';
      result.forEach((element) => {
        html += `<tr><td>${element.val}</td></tr>`;
      });
      html += '</table>';
    } else {
      text = 'No searches available';
    }
  } catch (e) {
    console.error(e);
  } finally {
    await databaseHandler.client.close();
  }

  let variables = {
    display: html,
    text: text,
  };

  response.render('search', variables);
});

app.post('/clear', async (request, response) => {
  try {
    await databaseHandler.client.connect();
    const result = await databaseHandler.client
      .db(process.env.MONGO_DB_NAME)
      .collection(process.env.MONGO_COLLECTION)
      .deleteMany({});
  } catch (error) {
    console.error(error);
  } finally {
    await databaseHandler.client.close();
  }

  response.redirect('../');
});
