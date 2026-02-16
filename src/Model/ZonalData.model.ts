import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const ZonalData = sequelize.define(
    "ZonalData",
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        division: { type: DataTypes.STRING, allowNull: true },
        date: { type: DataTypes.STRING, allowNull: true },
        figure: { type: DataTypes.STRING, allowNull: true },
        index: { type: DataTypes.STRING, allowNull: true },
        planheadno: { type: DataTypes.STRING, allowNull: true },
        planheadname: { type: DataTypes.STRING, allowNull: true },
        fglastyear: { type: DataTypes.STRING, allowNull: true },
        actualforthemonthlastyear: { type: DataTypes.STRING, allowNull: true },
        actualforthemonththisyear: { type: DataTypes.STRING, allowNull: true },
        rgbopenline: { type: DataTypes.STRING, allowNull: true },
        rgbconst: { type: DataTypes.STRING, allowNull: true },
        rgbtotal: { type: DataTypes.STRING, allowNull: true },
        actualuptothemonthlastyearopenline: { type: DataTypes.STRING, allowNull: true },
        actualuptothemonthlastyearconst: { type: DataTypes.STRING, allowNull: true },
        actualuptothemonthlastyeartotal: { type: DataTypes.STRING, allowNull: true },
        actualforthemonthopenline: { type: DataTypes.STRING, allowNull: true },
        actualforthemonthconst: { type: DataTypes.STRING, allowNull: true },
        actualforthemonthtotal: { type: DataTypes.STRING, allowNull: true },
        actualforthemonthlastyearopenline: { type: DataTypes.STRING, allowNull: true },
        actualforthemonthlastyearconst: { type: DataTypes.STRING, allowNull: true },
        actualforthemonthlastyeartotal: { type: DataTypes.STRING, allowNull: true },
        utilizationofopenline: { type: DataTypes.STRING, allowNull: true },
        utilizationofconst: { type: DataTypes.STRING, allowNull: true },
        utilizationoftotal: { type: DataTypes.STRING, allowNull: true },
        selectedMonthYear: { type: DataTypes.STRING, allowNull: true },
    },
    {
        freezeTableName: true,
        timestamps: true,
        indexes: [{ fields: ["uuid"] }],
    }
);

export default ZonalData;
