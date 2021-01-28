var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  userType: {type:String, required: true},
  registerUsername: {type:String, required: true},
  registerEmail: {type:String, required: true},
  registerPassword: {type:String, required: true}
});

var User = module.exports = mongoose.model('User', userSchema);


