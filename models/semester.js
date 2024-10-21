const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Semester schema
const semesterSchema = new Schema({
    name: { type: String, required: true },  // e.g., "Semester 1"
    year: { type: Number, required: true },  // e.g., 2024
    status: { type: String, enum: ['active', 'archived'], required: true } // Optional: status to indicate if the semester is active or archived
});

// Create the Semester model
const Semester = mongoose.model('Semester', semesterSchema);

// Export the Semester model
module.exports = Semester;
