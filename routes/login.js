var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
	console.log('in router edit')
res.render('login')
})

module.exports = router;