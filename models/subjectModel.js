const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    subject_name: { type: String, required: true },
    Abbreviation:{ type: String, required: true },
    subject_code: { type: String, required: true },
    credit_hours: { type: Number, required: true },
    subject_type: { type: Number, enum: [0,1], required: true }, // 0 is Lecture, 1 is Lab
    theory_professors: { type: [mongoose.Schema.Types.ObjectId], ref: 'Professor', required: true },
    practical_professors: { type: [mongoose.Schema.Types.ObjectId], ref: 'Professor' },
    status: {type:Number, enum:[0,1], default: 0, required: true} // 0 is inactive, 1 is active
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
