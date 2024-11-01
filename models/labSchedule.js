const mongoose = require('mongoose');

const labScheduleSchema = new mongoose.Schema({
  Lab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lab',
    required: true
  },
  Day: {
    type: Number,
    required: true
  },
  SlotNo: {
    type: Number,
    requred: true
  },
}, { timestamps: true });

const LabSchedule = mongoose.model('LabSchedule', labScheduleSchema);
module.exports = LabSchedule
