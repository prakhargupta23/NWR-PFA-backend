import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const AuditData = sequelize.define(
    "AuditData",
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
        unit: { type: DataTypes.STRING, allowNull: true },
        typeOfAuditObj: { type: DataTypes.STRING, allowNull: true },
        openingBalance: { type: DataTypes.STRING, allowNull: true },
        accretion: { type: DataTypes.STRING, allowNull: true },
        clearanceOld: { type: DataTypes.STRING, allowNull: true },
        clearanceNew: { type: DataTypes.STRING, allowNull: true },
        closingBalance: { type: DataTypes.STRING, allowNull: true },
        lessThanOneYearOld: { type: DataTypes.STRING, allowNull: true },
        moreThanOneYearOld: { type: DataTypes.STRING, allowNull: true },
        total: { type: DataTypes.STRING, allowNull: true },
        selectedMonthYear: { type: DataTypes.STRING, allowNull: true },
    },
    {
        freezeTableName: true,
        timestamps: true,
        indexes: [{ fields: ["uuid"] }],
    }
);

export default AuditData;
