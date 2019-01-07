var express = require('express');
//var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/user');




router.get('/', function(req, res, next) {
  res.render('home', {title:'Home'});
});


router.get('/index', function(req, res, next) {
	
    var perPage = 5;
    var lipages=[];
    var pageNo=req.query.p;
    var userSearch=req.query.search;
    if(userSearch){
		var query = {'username':userSearch}
	    var page = req.params.page || 1;
			User.getUserList(query,pageNo, function(err, user){
				User.count().exec(function(err, count) {
					pages = Math.ceil(count / perPage);

					for(i=1;i<=pages;i++){
					lipages.push(i);	
					}
					if (err) return next(err)
						res.render('index', {
						    Users: user,
						    current: page,
						    pages: 0,
						    lipages:lipages	
						});
					    });
				});
		}
	else{
		var page = req.params.page || 1;
			User.getUserList(query,pageNo, function(err, user){
				User.count().exec(function(err, count) {
					pages = Math.ceil(count / perPage);

					for(i=1;i<=pages;i++){
					lipages.push(i);	
					}
					if (err) return next(err)
						res.render('index', {
						    Users: user,
						    current: page,
						    pages: pages,
						    lipages:lipages	
						});
					    });
				});
	}
});


router.get('/index/details', function(req, res, next) {
	 var id=req.query.p;
	 //console.log(id);
	 User.getUserById(id, function(err, user) {
	 	//console.log(user);
		if(err) res.json(err);
		else res.render('details', 
				{Users: user
			});

	  });
	  	});

router.get('/index/search', function(req, res, next) {
	var lipages=[];
	//var resultArray=[];
	 var userSearch=req.query.search;
	 //console.log(userSearch);
	 User.getUserByUsername(userSearch, function(err, user) {
	 	console.log(user);
	 	//Users.forEach(resultArray.push(user));
		if(err) res.json(err);
		else res.render('index', 
				{Users: user,
					current: 0,
					    pages: 0,
					    lipages:lipages
			});

	  });
	  	});

router.get('/details/delete', function(req, res, next){
	var id=req.query.p;
	User.deleteUser(id, function(err){
		if(err) res.json(err);
		else res.redirect('/index');
	});
});



/*router.get('/details/update', function(req, res, next) {
  res.render('update',{title:'Update'});
});


router.get('/details/update', function(req, res, next) {
	 var id=req.query.p;
	 //console.log(id);
	 User.getUserById(id, function(err, user) {
	 	console.log(user);
		if(err) res.json(err);
		else res.render('details', 
				{Users: user
			});

	  });
	  	});
*/

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/login');
}


module.exports = router;
