var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var router = express.Router();
var models = require('../model');
var sequelize = models.sequelize;
var Emplolyee = models.employeetbl;
var Department = models.departmenttbl;
var Salary = models.salarytbl;
const bcrypt = require('bcrypt');
const commonFunction = require('../Utils/common');
const objMessage = require('../Utils/message');
const fs = require('fs');

const getAllEmployee = async(req, res) => {
    try {
        // console.log("Api Calling", models);

        const employeeList = await Emplolyee.findAll();
        if (employeeList && employeeList.length) {
            return res.json(employeeList);
        } else {
            return res.json("Not data available")
        }
    } catch (error) {
        console.log('Error : ', error);
        throw error
    }
}

const createEmployee = async(req, res) => {
    try {
        console.log('req.body :', req.body);
        const { name, address, username, password, email, gender, hobbies, dob } = req.body;
        if (username) {
            const encryptedPassword = bcrypt.hashSync(password, commonFunction.Salt);
            const queryObject = {
                name,
                address,
                username,
                password: encryptedPassword,
                email,
                role: 'Employee',
                status: 'disable',
                gender: gender,
                hobbies: hobbies,
                dob: dob
            }
            const checkQuery = {
                where: {
                    $or: [{ email: email }, { username: username }]
                }
            }

            const checkExists = await Emplolyee.findOne(checkQuery);
            if (checkExists) {
                if (queryObject.email === checkExists.email) {
                    return res.status(400).json({ message: "Email already exists." });
                }
                if (queryObject.username === checkExists.username) {
                    return res.status(400).json({ message: "Username already exists." });
                }
            } else {
                const payload = {
                    name: queryObject.name,
                    username: queryObject.username,
                    status: queryObject.status,
                    role: queryObject.role
                }
                const token = commonFunction.Sign(payload);
                queryObject.token = token
                const createEmployee = await Emplolyee.create(queryObject);
                if (createEmployee) {
                    console.log('createEmployee :', createEmployee.dataValues);
                    return res.status(201).json({ message: "Employee created successfully.", data: createEmployee.dataValues })
                }
            }
            // console.log('queryObject :', checkExists.email);
        } else {
            return res.status(400).json({ message: "Please enter username." })
        }
    } catch (error) {
        console.log('Error :', error);
        throw error
    }
}

const deleteEmployee = async(req, res) => {
    try {
        const employeeId = req.params.id;
        const checkExists = await Emplolyee.findOne({ where: { id: employeeId } });
        if (checkExists) {
            const deleteStudent = await Emplolyee.destroy({ where: { id: employeeId } });
            if (deleteStudent) {
                return res.status(200).json({ message: `Employee = ${checkExists.id} is deleted successfully.` })
            } else {
                return res.status(500).json({ message: "Something went wrong. Please try again." }, new Error)
            }
        } else {
            return res.status(404).json({ message: "Employee not found" });
        }
    } catch (error) {
        console.log('error :', error);
        throw error
    }
}

const imageUpload = async(req, res) => {
    const token = req.headers.authorization;
    const checkTokenStatus = await commonFunction.TokenStatus(token);
    if (checkTokenStatus) {
        if (checkTokenStatus.status && checkTokenStatus.status === 'active') {
            if (req.files && req.files.length) {
                console.log('req.files :', req.files);
                const fileName = req.files[0].filename
                const employeeId = req.files[0].fieldname
                const checkUser = await Emplolyee.findOne({ where: { id: employeeId } });
                if (checkUser) {
                    if (checkUser.profile && checkUser.profile != '') {
                        console.log('checkUser.profile :', checkUser.profile);
                        fs.unlink(`controller/EmployeeImage/${checkUser.profile}`, function(err) {
                            if (err) throw err;
                            // if no error, file has been deleted successfully
                            console.log('File deleted!');
                        });
                    }
                    const updateImage = await Emplolyee.update({ profile: fileName }, { where: { id: employeeId } });
                    if (updateImage) {
                        return res.status(200).json({ message: "Profile Updated Successfully." })
                    } else {
                        return res.status(500).json({ message: "Something went wrong." })
                    }
                } else {
                    return res.status(404).json(objMessage.RecordNotFound)
                }
            } else {
                return res.json({ message: "Please select at least one image" });
            }
        } else {
            return res.status(401).json({ message: "You are not authorized. Please provide valid token" })
        }
    } else {
        return res.status(500).json({ message: "Please provide token" });
    }
}

const departmentWiseEmployeeAndSalary = (req, res) => {
    if (req.headers.authorization) {
        commonFunction.TokenStatus(req.headers.authorization)
            .then(async function(resToken) {
                console.log('resToken :', resToken);
                if (resToken.status && resToken.status == 'active') {

                    Salary.belongsTo(Emplolyee, {
                        foreignKey: {
                            name: 'employeeId',
                            allowNull: true
                        }
                    });

                    Emplolyee.hasOne(Salary, {
                        foreignKey: {
                            name: 'employeeId',
                            allowNull: true
                        }
                    });

                    Department.hasMany(Emplolyee, {
                        foreignKey: {
                            name: 'departmentId',
                            allowNull: true
                        }
                    });

                    const deptObj = {
                        attributes: ['id', 'departmentName', 'address'],
                        include: [{
                            model: Emplolyee,
                            attributes: ['id', 'name', 'email', 'profile'],
                            include: [{
                                model: Salary,
                                attributes: ['id', 'employeeId', 'salary']
                            }]
                        }],
                    };

                    // Without Async Await Promices

                    Department.findAll(deptObj)
                        .then(function(response) {
                            if (response && response.length) {
                                return res.json({ status: true, data: response });

                            } else {
                                return res.json({ message: "Data not found" });
                            }
                        });

                    // With Async Await Promices

                    // const deptWithEmpData = await Department.findAll(deptObj);
                    // deptWithEmpData ? deptWithEmpData : [];

                    // return res.status(200).json({
                    //     success: true,
                    //     data: deptWithEmpData
                    // });

                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'Please login.'
                    });
                }
            })
            .catch(function(err) {
                console.error(err.stack || err.message);
                return res.status(404).json({
                    success: false,
                    message: 'Record(s) not found.'
                });
            });

    } else {
        res.json({
            success: false,
            message: 'Please provide token.'
        });
    }
}

module.exports = {
    getAllEmployee,
    createEmployee,
    deleteEmployee,
    imageUpload,
    departmentWiseEmployeeAndSalary
}