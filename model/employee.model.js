/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('employeetbl', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        username: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        gender: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        hobbies: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        dob: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        role: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        departmentId: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        salaryId: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        profile: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        token: {
            type: DataTypes.STRING(500),
            allowNull: true
        }
    }, {
        tableName: 'employeetbl'
    });
};