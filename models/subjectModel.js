// const mongoose = require('mongoose');

// const subjectSchema = new mongoose.Schema({
//   subjectCode: String,
//   subjectName: String,
//   abbreviation: String,
//   weeklyLectures: Number,
//   theoryProfs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Professor' }],
//   practicalProfs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Professor' }],
// });

// module.exports = mongoose.model('Subject', subjectSchema);



// new changes



const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subject_name: {
        type: String,
        required: true,
    },
    Abbreviation:{
        type: String,
        required: true
    },
    subject_code: {
        type: String,
        required: true
    },
    credit_hours: {
        type: Number,
        required: true,
    },
    semester: {
        type: String,
        required: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    subject_type: {
        type: String,
        required: true, // Lecture, Lab, Tutorial, etc.
    },
    theory_professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor',
        required: true,
    },
    practical_professor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor',
    }
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
