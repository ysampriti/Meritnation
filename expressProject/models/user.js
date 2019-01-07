var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
//var mongoosePaginate = require('mongoose-paginate');


mongoose.connect('mongodb://localhost/nodeauth');

var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	profileimage:{
		type: String
	}
});


var User = module.exports = mongoose.model('User', UserSchema);
//UserSchema.plugin(mongoosePaginate);

module.exports.getUserById = function(id, callback){
	var query = {"_id":id};
	User.find(query, callback);
}

module.exports.getUserList = function(query,pageNo, callback){
    var perPage = 5;
	var query = query;
	User.find(query, null, {skip:(pageNo * perPage)-perPage, limit:perPage},callback);
}

module.exports.getUserByUsername = function(userSearch, callback){
	var query = {"username": userSearch};
	console.log(query);
	User.findOne(query, callback);
}

module.exports.deleteUser = function(id, callback){
	var query = {"_id":id};
	User.deleteOne(query, callback);
	
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	callback(null, isMatch);
	});
}

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash(newUser.password, salt, function(err, hash) {
   			newUser.password = hash;
   			newUser.save(callback);
    	});
	});
}
