import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize";

export class Task extends Model {
    public uuid!: string;
    public createdby!: string;
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
        sequelize,
        tableName: "Tasks",
        timestamps: true,
    }
);

export default Task;

