const mongoose = require('mongoose')

const SyllabusSchema = new mongoose.Schema({
    ProgrammeName: {
        type: String,
        required: true
    },    
    Department: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Department', 
        required: true 
    },
    SemesterInfo: {
        // It is an array of all subjects in syllabus.
        // First Sub-array represents the semester
        // Semester sub-array reperesents the subjects. 
        // Multiple Subjects in same sub-array are electives
        // Single subject in sub-array means compulsary subject        
        type: [[[{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }]]],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true,
        default: 'active'
    }
})

const Syllabus = mongoose.model("Syllabus", SyllabusSchema)
module.exports = Syllabus