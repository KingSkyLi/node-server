var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    "user_name":{type:String},
    "user_pwd":{type:String}
});

module.exports = mongoose.model('userlist',userSchema,'userlist');
