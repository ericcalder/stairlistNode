var express = require('express');
var router = express.Router();
var fs = require('fs');
const mysql=require('mysql');
const connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'stairadmin',
      password: 'ericpass',
      database: 'stairadmin',
      timezone: 'utc'
    });

router.get('/', function(req,res){
	console.log('in router index')
res.render('index')
})

router.get('/export', function(req,res){
	console.log('in index/export')
	console.log('req.query=='+req.query.week)
	console.log('req.query=='+req.query.weekEnd)
	var week=req.query.week;
	var weekEnd=req.query.weekEnd;
	var qry="SELECT * from cleaners;";
	console.log('qry='+qry)
	var csv='';
	var header='id, stair, frequency, cleaner, next_clean \r\n';
	var csv=header;
	var cleaners=[]
	var freq=['weekly', 'A_week', 'B_week', '_3weekly','_4weekly','Monthly'];
	cleanerList(cleaners,cb);
	function cleanerList(cleaners, cb){
		connection.query(qry, function(err, rows){
			if(err) throw err;
			rows.forEach( (row) =>{
				cleaners.push([[row.id],[row.cleaner]])
			})//for each
			cb();
			
		})//conn
		//cb();
	}//func
    function cb(){
    	console.log('in callback+'+cleaners)
    ///////////////////////////////////////////////
    var qry="SELECT id, stair, freq, cleaner_id,"+
    		" DATE_FORMAT(next_clean, '%d %b %Y') AS date from stairlist"+
    		" WHERE freq!="+week+" &&(next_clean is null || next_clean<'"+weekEnd+"')"+
    		" order by cleaner_id limit 20;";
	console.log('qry='+qry)
    	connection.query(qry, function(err,rows){
          if(err) throw err;

          rows.forEach( (row) => { 
			  //console.log(`${row.id} has cleaner: ${row.cleaner}`);
			  //cleaners.push([[row.id],[row.cleaner]])
			  csv=csv+row.id+','+row.stair+','+freq[row.freq]+','+
			  cleaners[row.cleaner_id-1][1]+','+row.date+'\r\n'
	 
			  			});/// rows.forEach( (
		console.log('csv='+csv)   
		//console.log('cleaners arr='+cleaners[1])
		fs.writeFile('C:/tmp/my_csv.csv',csv,function(err){
			res.setHeader('content-type', 'text/csv');
			res.download('C:/tmp/my_csv.csv')
		})//fs.write callback      
                //res.send(rows)
                
            });//connection
    
    /////////////////////////////////////////////	
    }//callback
    
})//router.get

function processRow(row,csv) {
	csv=csv+row.id+','+row.cleaner+'\r\n'
	console.log('csv in func='+csv)
  //fs.appendFile('C:/tmp/my_csv.csv', row.id+','+row.cleaner+'\r\n', function (err) {
    //connection.resume();
  //});
}

module.exports = router;

