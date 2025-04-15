const mongoose = require('mongoose');

const TaskTypesSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true, unique: true },
  duration: { type: String, required: true},
  description: { type: String, default: '' },
  create_at: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
});

const TaskType = mongoose.model('Task_type', TaskTypesSchema);
module.exports = TaskType;
