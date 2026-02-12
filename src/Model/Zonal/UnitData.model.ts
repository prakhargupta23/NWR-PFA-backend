import { DataTypes } from "sequelize";
import sequelizeInstance from "../../config/sequelize";

const UnitData = sequelizeInstance.define("UnitData", {
    division: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    figure: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    index: {
        type: DataTypes.STRING, // row.a
        allowNull: true,
    },
    au: {
        type: DataTypes.STRING, // row.b
        allowNull: true,
    },
    planheadname: {
        type: DataTypes.STRING, // row.c
        allowNull: true,
    },
    rglastyear: {
        type: DataTypes.STRING, // row.d
        allowNull: true,
    },
    actualtotheendoflastyear: {
        type: DataTypes.STRING, // row.e
        allowNull: true,
    },
    actualforthemonthlastyear: {
        type: DataTypes.STRING, // row.f
        allowNull: true,
    },
    actualforthemonth: {
        type: DataTypes.STRING, // row.g
        allowNull: true,
    },
    percentageutilization: {
        type: DataTypes.STRING, // row.h
        allowNull: true,
    },
}, {
    freezeTableName: true,
    timestamps: true,
}
);

export default UnitData;
