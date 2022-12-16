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

app.post('/', function (request, response) {
  console.log(request.body)
  response.render('result.ejs');
});
