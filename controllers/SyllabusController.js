const Subject = require("../models/subjectModel")
const Syllabus = require("../models/Syllabus")

exports.getSyllabusInfo = async (req,res) => {
    try{
        const Syllabuses = await Syllabus.find({ status: "active" })
        if (!Syllabuses){
            res.status(400).json({ Message: "No Syllabus records found" })
        }        
        console.log(Syllabuses[0])
        res.status(200).json(Syllabuses)
    }
    catch(ex){
        res.status(500).json({ Message: ex.Message });
    }
}

// /GetByID/:SyllabusID
exports.getSyllabusByID = async (req,res) => {
    try{
        const syllabus = await Syllabus.findOne({ _id: req.params.SyllabusID,  status: "active" }).populate("SemesterInfo")
        if (!syllabus){
            res.status(400).json({ Message: "No Syllabus records found" })
        }        
        res.status(200).json(syllabus)
    }
    catch(ex){
        res.status(500).json({ Message: ex.message });
    }   
}

// /SemesterInfo/:SyllabusId/:semester
exports.getSemesterSubjects = async (req,res) => {
    try {
        // Subjects field in Syllabus is structured like so:
        // [ [ ID's for sem 1 ], [ ID's for sem 2 ], ...... [ ID's for sem n ] ]
        const syllabus = await Syllabus.findById(req.params.SyllabusID) // Select Syllabus
        const subjectGroups = syllabus.SemesterInfo[req.params.semester-1]  // Fetch all subjects in semester
        const subjectDetails = await Subject.find({ _id: { $in: subjectGroups.flat() } }); // Get all subjects in semester
        const detailsDict = {}
        subjectDetails.forEach( subj => {
            detailsDict[subj._id.toString()] = subj
        })
        const subjects = subjectGroups.map(grp => grp.map( subjId => detailsDict[subjId.toString()] ))
        res.status(200).json(subjects);
    } catch (err) {
        console.log(err.message)
        res.status(500).json({ message: err.message });
    }
}

exports.createSyllabus = async (req,res) => {
    try{
        const newSyllabus = new Syllabus(req.body);
        await newSyllabus.save()
        res.status(200).json({ Message: `Successfully created Syllabus ${newSyllabus.ProgrammeName}` });
    }
    catch(ex){
        res.status(500).json({ Message: ex.Message });
    }
}

exports.updateSyllabus = async (req,res) => {
    try{
        const updatedSyllabus = await Syllabus.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if ( !updatedSyllabus ){
            res.status(400).json({ Message: "Could not update record" })
        }
        res.status(200).json({ Message: "Record updated successfully" })
    }
    catch(ex){
        res.status(500).json({ Message: ex.Message });
    }
}

exports.deleteSyllabus = async (req,res) => {
    try{
        const deletedSyllabus = await Syllabus.findByIdAndDelete(req.params.id)
        if ( !deletedSyllabus ){
            res.status(400).json({ Message: "Could not delete record" })
        }
        res.status(200).json({ Message: "Successfully deleted record" })
    }
    catch(ex){
        res.status(500).json({ Message: ex.Message });
    }
}

// exports.x = async (req,res) => {
//     try{

//     }
//     catch(ex){
//         res.status(500).json({ Message: ex.Message });
//     }
// }