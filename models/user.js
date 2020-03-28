var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    username : String,
    password : String
});

// to add functions/features of passport-local-mongoose to UserSchema

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);