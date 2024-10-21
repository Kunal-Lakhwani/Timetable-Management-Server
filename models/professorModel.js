// const mongoose = require('mongoose');

// const professorSchema = new mongoose.Schema({
//   firstName: String,
//   middleName: String,
//   lastName: String,
//   slotIndex: Number,
//   joinedTimestamp: Date,
//   isActive: Boolean,
// });

// module.exports = mongoose.model('Professor', professorSchema);



const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  department: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department', 
    required: true 
  },
  Schedule: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: 'TimetableInfo',
    default: []
  },
  slotIndex: {
    type: Number,
    required: true,
    default: 0
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Professor', professorSchema);

