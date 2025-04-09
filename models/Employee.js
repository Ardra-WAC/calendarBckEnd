const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true }
});

module.exports = mongoose.model('Employee', employeeSchema);
