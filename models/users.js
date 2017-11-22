var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: {
    type: String
  },
  name: {
    type: String
  },
  avatar_url: {
    type: String,
    lowercase: true
  }
});

// methods ======================
// generating a hash
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('users', UserSchema);
