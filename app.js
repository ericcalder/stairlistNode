var express=require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

var app = express();
var index = require('./routes/index');
var home = require('./routes/home');
var edit = require('./routes/edit');
var login = require('./routes/login');
var cleaners = require('./routes/cleaners');


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/index', index);
app.use('/home', home);
app.use('/edit', edit);
app.use('/login', login);
app.use('/cleaners', cleaners);


app.get('/', function(req,res){
	console.log('in root');
res.render('login');
});



app.listen(process.env.PORT);