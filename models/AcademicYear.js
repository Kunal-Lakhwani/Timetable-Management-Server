const mongoose = require('mongoose');

const AcademicYearSchema = new mongoose.Schema({
    Title:{
        required: true,
        type: String,
    },
    Syllabus: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Syllabus', 
        required: true 
    },
    SemesterCount: {
        type: Number,
        required: true
    },
    Status: { 
      type: String, 
      enum: ['active', 'inactive'], 
      default: 'active'
    }
})

const AcademicYear = mongoose.model("AcademicYear", AcademicYearSchema)
module.exports = AcademicYear