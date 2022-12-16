process.stdin.setEncoding('utf8');

let http = require('http');
let path = require('path');
let express = require('express');
let app = express();
const portNumber = process.argv[2];
var bodyParser = require('body-parser');

http.createServer(app).listen(portNumber);
/* directory where templates will reside */
app.set('views', path.resolve(__dirname, 'templates'));

/* view/templating engine */
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/css', express.static(__dirname + '/css'));

app.get('/', function (request, response) {
  response.render('index.ejs');
});

app.get('/favoriteForm', (request, response) => {
  let variables = {
    port: portNumber,
  };
  response.render('favoriteForm', variables);
});

app.post('/favoriteForm', (request, response) => {
  let variables = {
    port: portNumber,
  };
  response.render('processForm', variables);
});

app.get('/favoritesList', (request, response) => {
  let variables = {
    name: request.body.name,
    email: request.body.email,
    gpa: request.body.gpa,
    background: request.body.background,
  };
  response.render('favoritesList', variables);
  client
    .db(databaseAndCollection.db)
    .collection(databaseAndCollection.collection)
    .insertOne(variables);
});
