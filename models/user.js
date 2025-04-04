const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  middle_name: { type: String, required: false },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true },
  birthdat: { type: String, required: true },
  phone: { type: String, required: true },
  active: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
