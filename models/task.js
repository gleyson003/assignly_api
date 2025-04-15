const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskTypeId: { type: String, required: true },
  professionalId:  { type: String },
  scheduleDate: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  scheduleHour: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  taskPrice: { type: Number },
  created_by:  { type: String, required: true},
  create_at: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  deleted: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
