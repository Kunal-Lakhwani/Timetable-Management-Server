const AcademicYear = require("../models/AcademicYear");

exports.getActiveYears = async (req, res) => {
    try{
        const activeYears = await AcademicYear.find({Status: "active"})
        res.status(200).json(activeYears)
    }catch(ex){
        res.status(500).json({Message: ex.message})
    }
};

exports.getInactiveYears = async (req, res) => {
    try{
        const inactiveYears = await AcademicYear.find({Status: "inactive"})
        res.status(200).json(inactiveYears)
    }catch(ex){
        res.status(500).json({Message: ex.message})
    }
};

exports.getSpecifiedYear = async (req, res) => {
    try{
        const specifiedYear = await AcademicYear.find({_id: req.params.id, Status: "active"}).populate("Syllabus")
        if (!specifiedYear){
            res.status(400).json({Message: "Specified Programme not found. It is either inactive or does not exist"})
        }
        res.status(200).json(specifiedYear)
    }catch(ex){
        res.status(500).json({Message: ex.message})
    }
}

exports.addAcademicYear = async (req, res) => {
    try{
        const {Title, SyllabusID, SemesterCount } = req.body
        const newYear = new AcademicYear({ Title:Title, Syllabus: SyllabusID, SemesterCount })
        await newYear.save()
        res.status(200).json({Message: `Successfully created ${Title}`})
    }catch(ex){
        res.status(500).json({Message: ex.message})
    }
};

exports.setInactive = async (req, res) => {
    try{
        const updatedYear = await AcademicYear.findByIdAndUpdate(req.params.id, {Status: "inactive"}, { new: true });
        if (!updatedYear){
            res.status(400).json({Message: `Record not found`})
        }
        res.status(200).json({Message: `Successfully set ${updatedYear.Title} to inactive`})
    }catch(ex){
        res.status(500).json({Message: ex.message})
    }
};

exports.updateAcademicYear = async (req, res) => {
    try{
        const updatedYear = await AcademicYear.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedYear){
            res.status(400).json({Message: `Record not found`})
        }
        res.status(200).json({Message: `Successfully updated ${updatedYear.Title}`})
    }catch(ex){
        res.status(500).json({Message: ex.message})
    }
};

exports.deleteAcademicYear = async (req, res) => {
    try{
        const deletedYear = await AcademicYear.findByIdAndDelete(req.params.id);
        if (!deletedYear) {
          return res.status(404).json({ message: 'Specified Programme not found' });
        }
        res.status(200).json({Message: `Successfully updated ${deletedYear.Title}`})
    }
    catch(ex){
        res.status(500).json({Message: ex.message})        
    }
};