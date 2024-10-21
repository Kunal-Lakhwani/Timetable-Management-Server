const LabSchedule = require('../models/LabSchedule');

exports.createLabSchedule = async (req, res) => {
  try {
    const labSchedule = new LabSchedule(req.body);
    await labSchedule.save();
    res.status(201).json(labSchedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllLabSchedules = async (req, res) => {
  try {
    const labSchedules = await LabSchedule.find();
    res.status(200).json(labSchedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLabScheduleById = async (req, res) => {
  try {
    const labSchedule = await LabSchedule.findById(req.params.id);
    if (!labSchedule) {
      return res.status(404).json({ message: 'Lab Schedule not found' });
    }
    res.status(200).json(labSchedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateLabSchedule = async (req, res) => {
  try {
    const labSchedule = await LabSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!labSchedule) {
      return res.status(404).json({ message: 'Lab Schedule not found' });
    }
    res.status(200).json(labSchedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteLabSchedule = async (req, res) => {
  try {
    const labSchedule = await LabSchedule.findByIdAndDelete(req.params.id);
    if (!labSchedule) {
      return res.status(404).json({ message: 'Lab Schedule not found' });
    }
    res.status(200).json({ message: 'Lab Schedule deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
