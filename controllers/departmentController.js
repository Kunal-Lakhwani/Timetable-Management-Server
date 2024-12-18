const Department = require('../models/department');

exports.createDepartment = async (req, res) => {
  try {
    const {name, branch} = req.body
    const newDepartment = new Department({Name: name, Branch: branch});
    await newDepartment.save();
    res.status(200).json(newDepartment);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({});
    res.status(200).json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
