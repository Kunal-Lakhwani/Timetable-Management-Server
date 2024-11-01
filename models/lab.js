const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Code: {
    type: String,
    required: true,
    unique: true
  },
  Department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  Subjects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Subject",
    required: true
  }
}, { timestamps: true });

const Lab = mongoose.model('Lab', labSchema);
module.exports = Lab
