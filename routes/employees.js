// import express from "express";
// import Employee from "../models/Employee.js"; 

// const router = express.Router();

// //write to
// router.post("/employee", async (req, res) => {
//     try {
//         const newEmployee = new Employee(req.body);
//         const savedEmployee = await newEmployee.save(); 

//         console.log(savedEmployee);
//         res.status(201).json({ msg: "Employee successfully added" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ msg: "Failed to add new Employee" });
//     }
// });

// //read all data
// router.get("/employee", async (req, res) => {
//     try {
//         const employees = await Employee.find();
//         console.log(employees);
//         res.status(200).json({ Employee: employees });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ msg: "Unable to get Employee Data" });
//     }
// });

// //read a particular data
// router.get("/employee/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const employee = await Employee.findById(id);
        
//         if (!employee) {
//             return res.status(404).json({ msg: "Employee not found" });
//         }
        
//         console.log(employee);
//         res.status(200).json({ Employee: employee });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ msg: "Unable to find Employee Data" });
//     }
// });

// // New route: Check employee by email
// router.post("/employee/check-email", async (req, res) => {
//     try {
//         const { email } = req.body;

//         if (!email) {
//             return res.status(400).json({ msg: "Email is required" });
//         }

//         const employee = await Employee.findOne({ email });

//         if (!employee) {
//             return res.status(404).json({ msg: "Employee not found" });
//         }

//         console.log(employee);
//         res.status(200).json({ 
//             Employee: {
//                 id: employee._id,
//                 email: employee.email,
//                 role: employee.role
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ msg: "Unable to check employee data" });
//     }
// });

// //Searching
//    //for testing use : http://localhost:3000/api/search?searchTerm=Project
// router.get("/search", async (req, res) => {
//     try {
//         const searchTerm = req.query.searchTerm;
//         if (!searchTerm) {
//             return res.status(400).json({ msg: "Search term is required" });
//         }

//         const searchRegex = new RegExp(searchTerm, 'i');

//         const employees = await Employee.find({
//             $or: [
//                 { email: searchRegex },
//                 { role: searchRegex },
//                 // Add more searchable fields as needed
//                 // { position: searchRegex },
//                 // { department: searchRegex }
//             ]
//         });

//         if (!employees || employees.length === 0) {
//             return res.status(404).json({ msg: "No matching employees found" });
//         }

//         console.log(employees);
//         res.status(200).json({ Employees: employees });

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ msg: "Error searching for employees" });
//     }
// });

// export default router; 

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