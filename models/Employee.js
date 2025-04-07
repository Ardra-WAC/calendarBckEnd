// import mongoose from "mongoose";

// const EmployeeSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: [true, "email is a required"],
//         unique: true,
//         trim: true
//     },
//     role: {
//         type: String,
//         required: [true, "Role is required"],
//         trim: true
//     }
// });

// export default mongoose.model("Employee", EmployeeSchema);

const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true }
});

module.exports = mongoose.model('Employee', employeeSchema);