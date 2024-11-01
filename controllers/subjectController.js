const Subject = require("../models/subjectModel");
// Create a new subject
exports.createSubject = async (req, res) => {
  const {
    subject_name,       
    Abbreviation,       
    subject_code,        
    credit_hours,
    subject_type,        
    theory_professors,    
    practical_professors, 
  } = req.body;

  const subject = new Subject({
    subject_name: subject_name,
    Abbreviation: Abbreviation,
    subject_code: subject_code,
    credit_hours: credit_hours,
    subject_type: subject_type,
    theory_professors: theory_professors,
  });

  if ( subject_type == "1" ){
    subject.practical_professors = practical_professors;
  }

  try {
    const savedSubject = await subject.save();
    res.status(200).json(savedSubject);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({status: 0})
          .populate("theory_professors", "FirstName LastName") // Populate theory_professor
          .populate("practical_professors", "FirstName LastName"); // Populate practical_professor with only the 'first_name' field
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById({_id: req.params.id, status: 0}).populate(
      "theory_professors practical_professors"
    );
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update subject
exports.updateSubject = async (req, res) => {
  const {
    subject_name,
    subject_code,
    Abbreviation,
    credit_hours,
    subject_type,
    theory_professors,
    practical_professors,
  } = req.body;

  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        subject_name,
        Abbreviation,
        subject_code,
        credit_hours,
        subject_type,
        theory_professors,
        practical_professors
      },
      { new: true }
    );
    if (!updatedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json(updatedSubject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
  try {
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

