// const Subject = require("../models/subjectModel");

// // Create a new subject
// exports.createSubject = async (req, res) => {
//   const {
//     subjectCode,
//     subjectName,
//     abbreviation,
//     weeklyLectures,
//     theoryProfs,
//     practicalProfs,
//   } = req.body;
//   const subject = new Subject({
//     subjectCode,
//     subjectName,
//     abbreviation,
//     weeklyLectures,
//     theoryProfs,
//     practicalProfs,
//   });
//   try {
//     const savedSubject = await subject.save();
//     res.status(201).json(savedSubject);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get all subjects
// // exports.getAllSubjects = async (req, res) => {
// //   try {
// //     const subjects = await Subject.find().populate('theoryProfs practicalProfs');
// //     res.status(200).json(subjects);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };
// exports.getAllSubjects = async (req, res) => {
//   try {
//     const subjects = await Subject.find()
//       .populate("theoryProfs", "firstName") // Populate theoryProfs with only the 'name' field
//       .populate("practicalProfs", "firstName"); // Populate practicalProfs with only the 'name' field

//     res.status(200).json(subjects);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get subject by ID
// exports.getSubjectById = async (req, res) => {
//   try {
//     const subject = await Subject.findById(req.params.id).populate(
//       "theoryProfs practicalProfs"
//     );
//     if (!subject) {
//       return res.status(404).json({ message: "Subject not found" });
//     }
//     res.status(200).json(subject);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Update subject
// exports.updateSubject = async (req, res) => {
//   const {
//     subjectCode,
//     subjectName,
//     abbreviation,
//     weeklyLectures,
//     theoryProfs,
//     practicalProfs,
//   } = req.body;
//   try {
//     const updatedSubject = await Subject.findByIdAndUpdate(
//       req.params.id,
//       {
//         subjectCode,
//         subjectName,
//         abbreviation,
//         weeklyLectures,
//         theoryProfs,
//         practicalProfs,
//       },
//       { new: true }
//     );
//     res.status(200).json(updatedSubject);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Delete subject
// exports.deleteSubject = async (req, res) => {
//   try {
//     await Subject.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Subject deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };




///new changes



const Subject = require("../models/subjectModel");

// Create a new subject
exports.createSubject = async (req, res) => {
  const {
    subject_name,       // Updated field name to match the model
    Abbreviation,       // Added Abbreviation field
    subject_code,       // Updated field name to match the model
    credit_hours,       // Updated field name to match the model
    semester,           // Updated field name to match the model
    department,         // Added department field
    subject_type,       // Updated field name to match the model
    theory_professor,   // Updated field name to match the model
    practical_professor, // Updated field name to match the model
  } = req.body;

  const subject = new Subject({
    subject_name: subject_name,
    Abbreviation: Abbreviation,
    subject_code: subject_code,
    credit_hours: credit_hours,
    semester: semester,
    department: department,
    subject_type: subject_type,
    theory_professor: theory_professor,
    practical_professor: practical_professor !== "" ? practical_professor : undefined,
  });

  try {
    const savedSubject = await subject.save();
    console.log(savedSubject);
    res.status(201).json(savedSubject);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({})
          .populate("department", "name") // Populate department
          .populate("theory_professor", "firstName ") // Populate theory_professor
          .populate("practical_professor", "firstName "); // Populate practical_professor with only the 'first_name' field
    res.status(200).json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all subjects in one semester
exports.getAllSubjectsInSemester = async (req, res) => {
  try {
    const semester = req.params.semester
    const subjects = await Subject.find( { semester: semester } )
    res.status(200).json(subjects);
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message });
  }
};

// Get subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate(
      "theory_professor practical_professor"
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
    subject_code,
    subject_name,
    credit_hours,
    semester,
    department,
    subject_type,
    theory_professor,
    practical_professor,
  } = req.body;

  try {
    const updatedSubject = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        subject_code,
        subject_name,
        credit_hours,
        semester,
        department,
        subject_type,
        theory_professor,
        practical_professor
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

