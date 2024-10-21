const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  labName: {
    type: String,
    required: true
  },
  labCode: {
    type: String,
    required: true,
    unique: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  resources: {
    type: [String],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Lab', labSchema);
