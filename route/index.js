const express = require('express');
const route = express.Router();
const Employee = require('../controller/employee');
const Department = require('../controller/department');
const Authentication = require('../controller/authenticate');
const upload = require('../controller/imageUpload');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

route.get("/api/v1/employee", Employee.getAllEmployee);
route.post("/api/v1/employee", Employee.createEmployee);
route.delete("/api/v1/employee/:id", Employee.deleteEmployee);

// Authentication Router
route.post("/api/v1/authentication/login", Authentication.login);
route.get("/api/v1/authentication/logout", Authentication.logout);

//After Login Route
route.post("/api/v1/employee/profileImage", upload.any(), Employee.imageUpload);
route.get("/api/v1/employee/departmentWiseEmployeeAndSalary", Employee.departmentWiseEmployeeAndSalary);

//Department
route.get("/api/v1/department", Department.getDepartment);
route.post("/api/v1/department", jsonParser, Department.SaveDepartment);
route.delete("/api/v1/department/:id", Department.deleteDepartment);
module.exports = route