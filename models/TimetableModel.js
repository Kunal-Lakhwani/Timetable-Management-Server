const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  deptID: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  Semester: { type: Number, required: true },
  Subjects: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'Subject',
    default: [],
  }
});

module.exports = mongoose.model('Timetable', timetableSchema);
