const mongoose = require('mongoose');

const labScheduleSchema = new mongoose.Schema({
  Day: {
    type: Number,
    required: true
  },
  SlotNo: {
    type: Number,
    requred: true
  },
  ScheduledLabs: {
    type: [[ {type: mongoose.Schema.Types.Mixed, ref: "Timetable"} ]]
  }
}, { timestamps: true });

const LabSchedule = mongoose.model('LabSchedule', labScheduleSchema);
module.exports = LabSchedule
