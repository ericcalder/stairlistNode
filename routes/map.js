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

//////////////////////////////////

router.get('/', function(req,res){

	console.log('in router map')
	var mm=req.query.markers
	console.log('data=='+req.query.markers)
	console.log('mm==='+JSON.parse(mm)[0])
	//console.log('markers==='+markers)
res.render('map',{user:req.session.email, markers:JSON.parse(mm)})

})

router.get('/show_map', fetch, function(req,res){
	console.log('in router show_map')
	console.log('req.markers=='+req.markers)
	res.send(req.markers);
})

module.exports = router;

