const mongoose = require('mongoose');

const GroupLabSchema = new mongoose.Schema({
  Subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  Professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: true
  }
}, {_id: false})

const groupSchema = new mongoose.Schema({
  Name: {type: String,required: true},
  Timetable: {type: mongoose.Schema.Types.ObjectId, ref: "Timetable", required: true},
  Labs: {
    type: [GroupLabSchema],
    required: true
  }  
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group