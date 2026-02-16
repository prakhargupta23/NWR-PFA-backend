import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export const Task = sequelize.define(
    "Task",
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        createdby: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        taskheading: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        segment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        division: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "Tasks",
        timestamps: true,
    }
);

export default Task;
