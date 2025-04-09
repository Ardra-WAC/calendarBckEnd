const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Check employee email and get role
router.post('/employee/check-email', async (req, res) => {
  const { email } = req.body;
  
  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.json({ Employee: null });
    }
    res.json({ Employee: { role: employee.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this route to add employees (for initial setup)
router.post('/employee', async (req, res) => {
  const { email, role } = req.body;
  
  const employee = new Employee({
    email,
    role
  });

  try {
    const newEmployee = await employee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
