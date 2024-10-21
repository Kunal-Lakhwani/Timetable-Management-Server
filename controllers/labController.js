const Lab = require('../models/lab');

exports.createLab = async (req, res) => {
  try {
    const lab = new Lab(req.body);
    await lab.save();
    res.status(201).json(lab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllLabs = async (req, res) => {
  try {
    const labs = await Lab.find();
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
