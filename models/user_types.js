const mongoose = require('mongoose');

const UserTypesSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true, unique: true },
  description: { type: String, default: '' },
  active: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
});

const UserType = mongoose.model('User_type', UserTypesSchema);
module.exports = UserType;
