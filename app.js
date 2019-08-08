var express=require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var fs = require('fs');
const mysql=require('mysql');
var session = require('express-session');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

if(process.env.JAWSDB_URL){
var connection = mysql.createConnection(process.env.JAWSDB_URL);  
}
else {
var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'stairadmin',
      password: 'ericpass',
      database: 'stairadmin',
      timezone: 'utc'
    });
}


var app = express();

var index = require('./routes/index');

var edit = require('./routes/edit');
var map = require('./routes/map');

var cleaners = require('./routes/cleaners');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
////// custom middleware //////////

const logIn=(req,res, next)=>{
	var password = req.body.password;
	var email = req.body.email;
	console.log('params=  '+password+' '+email)
	var qry='SELECT * FROM users WHERE email = ? AND password = ?';
	connection.query(qry, [email, password], function(error, results, fields) {
		if (results.length > 0) {
					req.session.loggedin = true;
					req.session.authenticated = true;
					req.session.email = email;
					console.log('results='+results)
		next();
		}
		 else {
		 	console.log('no results for login')
				res.render('login',{message:'Incorrect Username and/or Password!'})
				//res.send('Incorrect Username and/or Password!');
			}
	});//connection
}//auth
const isLoggedIn=(req, res, next)=>{
	 console.log('isLoggedIn CALLED '+req.session.loggedin);
    if (!req.session.loggedin) {
        res.redirect('/');
    }
    else {
    	next();
    }
}

///////////////////////////////////////////


app.get('/', function(req,res){
	console.log('in root');
res.render('login');
});

app.post('/', logIn,  function(req, res){
	console.log('in post')
	if(req.session.loggedin){
		res.render('index',{user:req.session.email})
	}
	
	//res.send('logged in')
})

app.get('/logout', function (req, res, next) {
		console.log('in logout')
		delete req.session.loggedin;
		console.log('req.session===='+req.session.loggedin)
		res.redirect('/');
	});
///// routes //////
app.use('/index',isLoggedIn, index);

app.use('/edit', isLoggedIn, edit);
app.use('/map', isLoggedIn, map);
app.use('/cleaners', isLoggedIn, cleaners);



app.listen(port);