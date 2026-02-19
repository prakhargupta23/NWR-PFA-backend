import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

<<<<<<< HEAD
export const Task = sequelize.define(
    "Task",
=======
export class Task extends Model {
    public uuid!: string;
    public taskId!: string;
    public msgId!: string;
    public createdby!: string;
    public assignedTo!: string;
    public status!: string;
    public taskheading!: string;
    public content!: string;
    public segment!: string;
    public division!: string;
    public type!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Task.init(
>>>>>>> 2aa15caa9579f97ee89f8612fe892440df1e8622
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
        taskId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        msgId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        assignedTo: {
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

