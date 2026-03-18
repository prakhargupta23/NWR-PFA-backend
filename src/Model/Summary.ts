import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const Summary = sequelize.define(
    "Summary",
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },

        type: { type: DataTypes.STRING, allowNull: true },
        date: { type: DataTypes.STRING, allowNull: true },
        content: { type: DataTypes.STRING, allowNull: true },

    },
    {
        freezeTableName: true,
        timestamps: true,
        indexes: [{ fields: ["uuid"] }],
    }
);

export default Summary;
