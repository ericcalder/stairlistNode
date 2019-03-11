var express = require('express');
var router = express.Router();
var CsvReadableStream = require('csv-reader');
var fs = require('fs');
//var bodyParser = require('body-parser');
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
res.render('home')
})

router.get('/download', function(req,res){
	console.log('in /download');
  console.log('req.query=='+req.query.fileName)
  var inputStream = fs.createReadStream('C:/Users/Rhoda/Downloads/'+req.query.fileName, 'utf8');
  var record=[];
  var data=[];
  //var data='';
  inputStream
    .pipe(CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
    .on('data', function (row) {
        //console.log('A row arrived: ', row[0]+'  '+row[1]+'  '+row[4]);
        //console.log('parseFloat(row[1])'+parseFloat(row[1]))
        
          //console.log('greater than zero')
        data.push([row[0],row[1],row[2],row[3]]);
       
        //console.log('data+++++'+data[0])
    })
    .on('end', function () {
      //  console.log('No more rows!');
        console.log('data===='+data[0]);
        
        res.send(data);
      //res.redirect('payments',{data: data})
    });
  
  //res.end();
})

router.post('/insert', function(req,res){
	console.log('in insert')
	//console.log('req.body'+req.body.dta)
	var pay=JSON.parse(req.body.data);

	var freq=['weekly', 'A_week', 'B_week', '_3weekly','_4weekly','Monthly'];
	var cleaner=['','Eric','Barbara Bernetek','Szilvia Halo','Calum Compton',
    				'Ken Littlewood', 'joanne'];
    var freq_= freq.indexOf(pay[0][1])
    var cleaner_id=cleaner.indexOf(pay[0][2])
console.log('pay==='+pay[0][0]+' '+pay[0][1]+' '+pay[0][2]);
console.log('pay==='+pay[0][0]+' '+freq_+' '+cleaner_id);
console.log('pay.length=='+pay.length)
var val=''
var vals=''
for(i=0;i<pay.length;i++){
	var freq_= freq.indexOf(pay[i][1])
    var cleaner_id=cleaner.indexOf(pay[i][2])
	 val="('"+pay[i][0]+"', "+freq_+", "+cleaner_id+
			", STR_TO_DATE('"+pay[i][3]+"','%d-%b-%y')),";
	vals=vals.concat(val)    
}
vals=vals.slice(0,vals.length-1)

console.log('vals=='+vals)
var qry="INSERT INTO stairlist (stair, freq, cleaner_id, next_clean) "+
		"VALUES "+vals+";";
		//"('"+pay[0][0]+"', "+freq_+", "+cleaner_id+
		//	", STR_TO_DATE('"+pay[0][3]+"','%d-%b-%y'));";
		console.log('qry=='+qry)
/////////////////////////////////////////
/*
	connection.query(qry, function(err,result,fields){
		if(err) throw err;
		res.send(result)

	})
*/
//////////////////////////////////////////
	res.end('done without connection');
})

//////////////////////////////////
function csvToMySqlDate(date){
  var month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var DD=date.slice(0,2);
  var MM=date.slice(3,6);
  var mm = month.indexOf(MM)+1;
  mm=("0" + mm).slice(-2);
  var YYYY='20'+date.slice(7,9);
  //console.log('DD+MM+YYYY='+DD+'  '+mm+'  '+YYYY);
  //console.log('date='+YYYY+'-'+mm+'-'+DD)
  return YYYY+'-'+mm+'-'+DD;
}
//////////

module.exports = router;
