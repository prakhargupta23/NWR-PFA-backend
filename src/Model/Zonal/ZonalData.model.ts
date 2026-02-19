import { DataTypes } from "sequelize";
import sequelizeInstance from "../../config/sequelize";

const ZonalData = sequelizeInstance.define("ZonalData", {
    division: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE, // Using DATE as it handles date & time, typical for 'formattedDate'
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
    planheadno: {
        type: DataTypes.STRING, // row.b
        allowNull: true,
    },
    planheadname: {
        type: DataTypes.STRING, // row.c
        allowNull: true,
    },
    fglastyear: {
        type: DataTypes.STRING, // row.d
        allowNull: true,
    },
    actualforthemonthlastyear: {
        type: DataTypes.STRING, // row.e
        allowNull: true,
    },
    actualforthemonththisyear: {
        type: DataTypes.STRING, // row.f
        allowNull: true,
    },
    rgbopenline: {
        type: DataTypes.STRING, // row.g
        allowNull: true,
    },
    rgbconst: {
        type: DataTypes.STRING, // row.h
        allowNull: true,
    },
    rgbtotal: {
        type: DataTypes.STRING, // row.i
        allowNull: true,
    },
    actualuptothemonthlastyearopenline: {
        type: DataTypes.STRING, // row.j
        allowNull: true,
    },
    actualuptothemonthlastyearconst: {
        type: DataTypes.STRING, // row.k
        allowNull: true,
    },
    actualuptothemonthlastyeartotal: {
        type: DataTypes.STRING, // row.l
        allowNull: true,
    },
    actualforthemonthopenline: {
        type: DataTypes.STRING, // row.m
        allowNull: true,
    },
    actualforthemonthconst: {
        type: DataTypes.STRING, // row.n
        allowNull: true,
    },
    actualforthemonthtotal: {
        type: DataTypes.STRING, // row.o
        allowNull: true,
    },
    actualforthemonthlastyearopenline: {
        type: DataTypes.STRING, // row.p
        allowNull: true,
    },
    actualforthemonthlastyearconst: {
        type: DataTypes.STRING, // row.q
        allowNull: true,
    },
    actualforthemonthlastyeartotal: {
        type: DataTypes.STRING, // row.r
        allowNull: true,
    },
    utilizationofopenline: {
        type: DataTypes.STRING, // row.s
        allowNull: true,
    },
    utilizationofconst: {
        type: DataTypes.STRING, // row.t
        allowNull: true,
    },
    utilizationoftotal: {
        type: DataTypes.STRING, // row.u
        allowNull: true,
    },
}, {
    freezeTableName: true,
    timestamps: true,
}
);

export default ZonalData;
