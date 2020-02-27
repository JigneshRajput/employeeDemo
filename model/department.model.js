/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('departmenttbl', {
        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        departmentName: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        address: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        CreatedDate: {
            type: DataTypes.DATE,
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
        tableName: 'departmenttbl'
    });
};