const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  Subjects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Subject',
    required: true
  }
});

module.exports = mongoose.model('Group', groupSchema);