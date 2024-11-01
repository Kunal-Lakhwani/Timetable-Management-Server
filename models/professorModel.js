const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  FirstName: { type: String, required: true },
  MiddleName: {type: String},
  LastName: { type: String, required:true },
  Department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department', 
    required: true 
  },
  Schedule: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'TimetableInfo',
    default: []
  },
  SlotIndex: {
    type: Number,
    required: true,
    default: 0
  },
  Status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    required: true,
    default: 'active' 
  }
}, { timestamps: true });

const Professor = mongoose.model('Professor', professorSchema);
module.exports = Professor