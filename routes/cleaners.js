var express = require('express');
var router = express.Router();
var path = require('path');
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
	console.log('in router claeners')
	var id='';
res.render('cleaners',{id:id})
})

router.get('/cleanerslist', function(req,res){
  res.render('cleanerslist')
})

router.get('/cleanerslist/data', function(req,res){
  console.log('in cleanerslist/data')
  var qry="SELECT id, cleaner"+
      " from cleaners;";
      
  console.log('qry='+qry)
  connection.query(qry, function(err,rows){
          if(err) throw err;
          
                res.send(rows)
            });//connection

})

router.get('/cleanerslist/delete', function(req,res){
  //console.log('in /cleanerslist/delete')
  //console.log('req.query='+JSON.stringify(req.query.id))
  //console.log('req.query='+JSON.parse(req.query.id))
  var qry="DELETE from cleaners"+
          " WHERE id="+JSON.parse(req.query.id)+";";
  //console.log('delete qry='+qry)
    connection.query(qry, function(err,result,fields){
          if(err) throw err;
           // console.log('Data received from Db:\n');
           // console.log('the variable rows====',rows);
            console.log('result=='+JSON.stringify(result)+'   '+result.affectedRows)
                res.send(result)
            });//connection 
  //res.end();
})


router.post('/cleanerslist/new',function(req,res){
  console.log('in new cleaner')
  console.log('req.body='+JSON.parse(req.body.arr)[0].value)
  var name=JSON.parse(req.body.arr)[0].value
  var qry="INSERT into cleaners"+
          " (cleaner)"+
          " VALUES ('"+name+"');";
  console.log('qry=='+qry)
  connection.query(qry, function(err,result,fields){
          if(err) throw err;
           // console.log('Data received from Db:\n');
           // console.log('the variable rows====',rows);
            console.log('result=='+JSON.stringify(result)+'   '+result.changedRows)
                res.send(result)
            });//connection 
  //res.end()
})

router.get('/menu', function(req,res){
	console.log('in router cleaners/menu')
	var qry="SELECT id, cleaner"+
			" from cleaners;";
			
	console.log('qry='+qry)
	connection.query(qry, function(err,rows){
          if(err) throw err;
          
                res.send(rows)
            });//connection

//res.end('edit')
})

router.get('/:id', function(req,res){
	console.log('in router claeners name id')
	var id1 = req.params.id
    	id=id1.slice(0,id1.indexOf('&'))
    var name = id1.slice(id1.indexOf('=')+1)
       console.log('req.params='+id+'  '+name)
    var freq=['weekly', 'A_week', 'B_week', '_3weekly','_4weekly','Monthly'];

     var qry="SELECT id, stair, freq,"+
     		" DATE_FORMAT(next_clean, '%d %b %Y') AS date from stairlist "+
     		 " WHERE cleaner_id="+id+";";
     console.log('qry='+qry)
     connection.query(qry, function(err,rows){
          if(err) throw err;
          	console.log('freq='+freq[0])
			res.render('cleaners',{id:id, name:name, freq:freq, rows:rows })
            });//connection

//res.render('cleaners',{id:id, name:name})
})

module.exports = router;