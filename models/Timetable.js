const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  AcademicYear: {type: mongoose.Schema.Types.ObjectId, ref: "AcademicYear", required: true},
  Semester: { type: Number, required: true },
  Subjects: {
    type: [
      [{type: mongoose.Schema.Types.ObjectId, ref: 'Subject'}]
    ],     
    default: [],
  }
});

const Timetable = mongoose.model('Timetable', timetableSchema);
module.exports = Timetable
