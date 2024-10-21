const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  timetableID: { type: mongoose.Schema.Types.ObjectId, ref: 'Timetable', required: true },
  day: {type: Number, required: true},
  slotNo: {type: Number, required: true},
  subjects: { type: [mongoose.Schema.Types.ObjectId], ref: 'Subject'},
  type: {
    type: Number,
    enum: [0,1],
    required: true
  },  // 0 = theory, 1 = lab
  groupId: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Group'
  },
});

module.exports = mongoose.model('TimetableInfo', timetableSchema);
