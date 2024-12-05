const mongoose = require('mongoose');


const DetailsSchema = new mongoose.Schema({
  Subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true},
  Professor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true},
  Group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
  Lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab'}
}, {_id: false})

const timetableSchema = new mongoose.Schema({
  Timetable: { type: mongoose.Schema.Types.ObjectId, ref: 'Timetable', required: true },
  Day: {type: Number, required: true},
  SlotNo: {type: Number, required: true},
  Type: {
    type: Number,
    enum: [-1, 0, 1],
    required: true
  },  // 0 = theory, 1 = lab
  Details: { type: [DetailsSchema], default: []},
});

const TimetableInfo = mongoose.model('TimetableInfo', timetableSchema);
module.exports = TimetableInfo