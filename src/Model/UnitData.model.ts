import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const UnitData = sequelize.define(
    "UnitData",
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
        au: { type: DataTypes.STRING, allowNull: true },
        planheadname: { type: DataTypes.STRING, allowNull: true },
        rglastyear: { type: DataTypes.STRING, allowNull: true },
        actualtotheendoflastyear: { type: DataTypes.STRING, allowNull: true },
        actualforthemonthlastyear: { type: DataTypes.STRING, allowNull: true },
        actualforthemonth: { type: DataTypes.STRING, allowNull: true },
        percentageutilization: { type: DataTypes.STRING, allowNull: true },
        selectedMonthYear: { type: DataTypes.STRING, allowNull: true },
    },
    {
        freezeTableName: true,
        timestamps: true,
        indexes: [{ fields: ["uuid"] }],
    }
);

export default UnitData;
