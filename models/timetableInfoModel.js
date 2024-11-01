const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  Timetable: { type: mongoose.Schema.Types.ObjectId, ref: 'Timetable', required: true },
  Day: {type: Number, required: true},
  SlotNo: {type: Number, required: true},
  Subjects: { type: [mongoose.Schema.Types.ObjectId], ref: 'Subject'},
  Type: {
    type: Number,
    enum: [0,1],
    required: true
  },  // 0 = theory, 1 = lab
  Group: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Group'
  },
});

const TimetableInfo = mongoose.model('TimetableInfo', timetableSchema);
module.exports = TimetableInfo