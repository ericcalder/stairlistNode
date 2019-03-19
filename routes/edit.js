var express = require('express');
var router = express.Router();

const mysql=require('mysql');
/*
const connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'stairadmin',
      password: 'ericpass',
      database: 'stairadmin',
      timezone: 'utc'
    });
 */
const connection = mysql.createConnection(process.env.JAWSDB_URL);
/// changes connection to JAWSDB

router.get('/', function(req,res){
	console.log('in router edit')

	router.get('/cleaners', function(req,res){
	console.log('in router cleaners')
	var qry="SELECT id, cleaner"+
			" from cleaners;";
			
	console.log('qry='+qry)
		connection.query(qry, function(err,rows){
          if(err) throw err;
          res.send(rows)
          //res.render('edit',{name: rows})
      	//cback(res,rows)	
      	});//conn

	})// get cleaners
	
	
//res.end('fin')
res.render('edit',{name: 'hjhjhjh'})
})


router.get('/load', function(req,res){
	console.log('in router load')
	var qry="SELECT s.id, s.stair, s.postcode, s.freq, s.cleaner_id, s.next_clean, c.cleaner"+
			" from stairlist AS s "+
			"inner join cleaners as c on c.id=s.cleaner_id "+
			"order by s.stair; ";
			//"limit 100;";
	console.log('qry='+qry)

		connection.query(qry, function(err,rows){
          if(err) throw err;
           // console.log('Data received from Db:\n');
           // console.log('the variable rows====',rows);
                rows.forEach( (row) => { 
             //     console.log(`${row.name} is in ${row.email} and ${row.prop}`); 
                });//for each
                //res.send('custID='+custID+'   '+JSON.stringify(rows)+
                //	'       '+rows[0].name);
                res.send(rows)
            });//connection

//res.end('edit')
})

router.get('/cleaners', function(req,res){
	console.log('in router cleaners')
	var qry="SELECT id, cleaner"+
			" from cleaners;";
			
	console.log('qry='+qry)
connection.query(qry, function(err,rows){
          if(err) throw err;
           // console.log('Data received from Db:\n');
           // console.log('the variable rows====',rows);
                rows.forEach( (row) => { 
             //     console.log(`${row.name} is in ${row.email} and ${row.prop}`); 
                });//for each
                //res.send('custID='+custID+'   '+JSON.stringify(rows)+
                //	'       '+rows[0].name);
                //res.locals.crow=rows
                res.send(rows)
            });//connection

//res.end('edit')
})
router.post('/form_add',function(req, res){
		console.log('in router form_update')
	console.log('req.body.arr=='+req.body.arr)
	console.log('parse=='+JSON.parse(req.body.arr))
	var vals=JSON.parse(req.body.arr)
	if(vals[3].value){
	var qry="INSERT INTO stairlist"+
			" (stair, postcode, freq, next_clean, cleaner_id)"+
			" VALUES ('"+vals[0].value+"', '"+
				vals[1].value+"', "+vals[2].value+
				", STR_TO_DATE('"+vals[3].value+"','%Y-%m-%d')"+
				", "+vals[4].value+");";
				}//if
	else{
		var qry="INSERT INTO stairlist"+
			" (stair, postcode, freq, cleaner_id)"+
			" VALUES ('"+vals[0].value+"', '"+
				vals[1].value+"', "+vals[2].value+
				", "+vals[4].value+");";
	}
	console.log('qry+++'+qry)
	connection.query(qry, function(err,result,fields){
          if(err) throw err;
           // console.log('Data received from Db:\n');
           // console.log('the variable rows====',rows);
            console.log('result=='+JSON.stringify(result)+'   '+result.changedRows)
                res.send(result)
            });//connection		
	//res.send(vals)
})


router.post('/form_update', function(req,res){
	console.log('in router form_update')
	console.log('req.body.arr=='+req.body.arr)
	console.log('parse=='+JSON.parse(req.body.arr))
	var vals=JSON.parse(req.body.arr)
	console.log('vals[0]='+vals[0].name)
	if(vals[2].value){
	var qry="UPDATE stairlist"+
			" SET freq="+vals[1].value+
				", cleaner_id="+vals[3].value+
				", next_clean=STR_TO_DATE('"+vals[2].value+"','%Y-%m-%d')"+
				" WHERE id="+vals[0].value+";";
			}
	else {
		var qry="UPDATE stairlist"+
			" SET freq="+vals[1].value+
				", cleaner_id="+vals[3].value+
				" WHERE id="+vals[0].value+";";
	}
	console.log('qry='+qry)
	connection.query(qry, function(err,result,fields){
          if(err) throw err;
           // console.log('Data received from Db:\n');
           // console.log('the variable rows====',rows);
            console.log('result=='+JSON.stringify(result)+'   '+result.changedRows)
                res.send(result)
            });//connection
//res.end();
	})

router.get('/delete', function(req, res){
	console.log('in delete')
	console.log('req.query.row='+JSON.stringify(req.query.row)+
		' row.id=  '+req.query.row.id+'    '+req.query.row.stair)
	var qry=" DELETE from stairlist"+
			" WHERE id="+req.query.row.id+";";
	console.log('qry='+qry)
	connection.query(qry, function(err,result,fields){
          if(err) throw err;
           // console.log('Data received from Db:\n');
           // console.log('the variable rows====',rows);
            console.log('result=='+JSON.stringify(result)+'   '+result.changedRows)
                res.send(result)
            });//connection
            
	//res.end('delete')
})

module.exports = router;
