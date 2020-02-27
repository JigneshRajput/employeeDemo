/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('salarytbl', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        salary: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        CreatedDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        employeeId: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        departmentId: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        CreatedBy: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        ModifiedDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        ModifiedBy: {
            type: DataTypes.STRING(45),
            allowNull: true
        }
    }, {
        tableName: 'salarytbl'
    });
};