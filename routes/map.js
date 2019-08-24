var express = require('express');
var router = express.Router();
var fs = require('fs');
const mysql=require('mysql');

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


var googleMapsClient = require('@google/maps').createClient({
  key: process.env.API_KEY//'AIzaSyDOzqzaTTfXUp9-NtSJCnpaK59YibAZJeQ'
});

/////////middleware ///
const fetch=(req, res, next)=>{
	console.log('in fetch')
	console.log('id=='+req.query.id)
	console.log('rows=='+req.query.rows[0].stair)
	var qry='SELECT stair, lat, lng from stairlist'+
			' WHERE cleaner_id='+req.query.id+';';
			console.log('qry=='+qry)
			connection.query(qry, function(err,rows){
          if(err) throw err;
           // console.log('Data received from Db:\n');
           // console.log('the variable rows====',rows);
            console.log('rows=='+JSON.stringify(rows))
                req.markers=rows
                next()
                //res.send(rows)
            });//connection
	
}

var getGeo=(req,res,next)=>{
	googleMapsClient.geocode({
  		address: '1600 Amphitheatre Parkway, Mountain View, CA'
			}, function(err, res) {
  				if (!err) {
    				console.log(res.json.results);
  					req.data=res.json.results;	
  				}// if
  			//res.send('hello'+res.json.results);
  			next();
  			}//callback
  			
	);//googleMapsClient

}
//////////////////////////////////

router.get('/', function(req,res){

	console.log('in router map')
	var mm=req.query.markers
	console.log('data=='+req.query.markers)
	console.log('mm==='+JSON.parse(mm)[0])
	//console.log('markers==='+markers)
	res.locals.apikey=JSON.stringify(process.env.API_KEY);
res.render('map',{user:req.session.email, markers:JSON.parse(mm)})

})

router.get('/show_map', getGeo, function(req,res){
	console.log('in router show_map')
	
	
	res.send('hello'+JSON.stringify(req.data))
	
});//

module.exports = router;

