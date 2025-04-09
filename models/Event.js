const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  meetingDate: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  meetingRoom: { type: String, required: true },
  createdBy: { type: String, required: true },
  createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
