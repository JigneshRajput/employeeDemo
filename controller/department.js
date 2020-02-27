var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var models = require('../model');
var sequelize = models.sequelize;
var Emplolyee = models.employeetbl;
var Department = models.departmenttbl;
var Salary = models.salarytbl;
const commonFunction = require('../Utils/common');
const objMessage = require('../Utils/message');

const SaveDepartment = async(req, res) => {
    const token = req.headers.authorization;
    const checkTokenStatus = await commonFunction.TokenStatus(token);
    if (checkTokenStatus) {
        console.log('checkTokenStatus :', checkTokenStatus);
        var IsUpdate = false;
        if (checkTokenStatus.status && checkTokenStatus.status === 'active' && checkTokenStatus.role === 'Admin') {
            const departmentName = req.body.departmentName
            if (departmentName) {
                const checkDepartment = await Department.findOne({ where: { departmentName: departmentName } });
                if (checkDepartment) {
                    return res.json({ message: "Department already exists." })
                } else {
                    if (req.body.id) {
                        req.body.ModifiedDate = new Date();
                        req.body.ModifiedBy = checkTokenStatus.name;
                        const updateDepartment = await Department.update(req.body, { where: { id: req.body.id } });
                        updateDepartment ? res.json({ message: "Department Updated Successfully." }) : res.json({ status: false })
                            // if (updateDepartment) { return res.json({ message: "Department Updated Successfully." }) }
                    } else {
                        req.body.CreatedDate = new Date
                        req.body.CreatedBy = checkTokenStatus.name
                        const createDepartment = await Department.create(req.body);
                        createDepartment ? res.json({ message: "Department created successfully." }) : res.json({ message: "Error while creating department" });
                    }
                }
            } else {
                return res.json({ message: "Please enter department name" })
            }
            // sequelize.transaction(function(t) {
            //         return Department.findOne({
            //             where: { id: req.body.id }
            //         }).then(function(results) {
            //             if (results) {
            //                 return Department.findOne({
            //                     where: {
            //                         id: { $ne: req.body.id },
            //                         $or: [{ departmentName: req.body.departmentName }]
            //                     }
            //                 }).then(function(resultCheck) {
            //                     console.log('results :', resultCheck);
            //                     if (resultCheck) {
            //                         console.log('req.body :', req.body);
            //                         return {
            //                             success: false,
            //                             message: 'Department already exist.',
            //                             data: resultCheck
            //                         };
            //                     } else {
            //                         IsUpdate = true;
            //                         req.body.ModifiedDate = new Date();
            //                         req.body.ModifiedBy = checkTokenStatus.username;

            //                         return results.update(req.body);
            //                     }
            //                 })
            //             } else {
            //                 req.body.CreatedDate = new Date();
            //                 req.body.CreatedBy = checkTokenStatus.username;
            //                 return Department.findOrCreate({ where: { departmentName: req.body.departmentName }, defaults: req.body });
            //             }
            //         })
            //     })
            //     .then(function(result) {
            //         if (result) {
            //             res.json({ result: result });
            //         } else {
            //             if (IsUpdate) {
            //                 res.json({
            //                     success: true,
            //                     message: 'Department saved successfully.',
            //                     data: result
            //                 });
            //             } else {
            //                 res.json({
            //                     success: false,
            //                     message: 'Department already exist..',
            //                     data: result
            //                 });
            //             }
            //         }
            //     })
            //     .catch(function(err) {
            //         console.error(err.stack || err.message);
            //         res.json({
            //             success: false,
            //             message: 'Failed to save record. Please try again later.',
            //         });
            //     })
        } else {
            return res.status(401).json({ message: "You are not authorized. Please provide valid token" })
        }
    } else {
        return res.status(500).json({ message: "Please provide token" });
    }
}

const getDepartment = async(req, res) => {
    try {
        // console.log("Api Calling", models);

        const departmentList = await Department.findAll();
        if (departmentList && departmentList.length) {
            return res.json(departmentList);
        } else {
            return res.json("Not data available")
        }
    } catch (error) {
        console.log('Error : ', error);
        throw error
    }
}

const deleteDepartment = (req, res) => {

}

module.exports = {
    SaveDepartment,
    getDepartment,
    deleteDepartment
}