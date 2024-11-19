const Lab = require('../models/lab');
const LabSchedule = require('../models/LabSchedule')

exports.createLab = async (req, res) => {
  try {
    const lab = new Lab(req.body);
    const Schedule = await LabSchedule.find({})    
    if( Schedule.length === 0 ){
      // First ever lab, initialise labSchedule
      // 6 days of week
      for (let i = 1; i <= 6; i++) {
        // 10 periods
        for(let j=1; j <= 10; j++){
          Schedule.push(new LabSchedule({ Day: i, SlotNo: j, ScheduledLabs: [[]]}));
        }
      }
      await LabSchedule.insertMany(Schedule);
    }
    LabSchedule.updateMany({}, { $push: { ScheduledLabs: []} })
    lab.LabIndex = Schedule[0].ScheduledLabs.length
    await lab.save();
    res.status(201).json(lab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllLabs = async (req, res) => {
  try {
    const labs = await Lab.find().populate("Department").populate("Subjects");
    res.status(200).json(labs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLabById = async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }
    res.status(200).json(lab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLabsWithSubjects = async (req, res) => {
  try {
    const SubjectIDs = req.body
    const labs = {}
    for (let i = 0; i < SubjectIDs.length; i++) {
      labs[SubjectIDs[i]] = await Lab.find({ Subjects: SubjectIDs[i] })
    }
    if (!labs) {
      return res.status(404).json({ message: 'Labs not found' });
    }
    res.status(200).json(labs);
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: err.message });
  }
};

exports.updateLab = async (req, res) => {
  try {
    const lab = await Lab.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }
    res.status(200).json(lab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteLab = async (req, res) => {
  try {
    const lab = await Lab.findByIdAndDelete(req.params.id);
    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }
    res.status(200).json({ message: 'Lab deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
