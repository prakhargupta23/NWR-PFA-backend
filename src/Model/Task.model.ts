import { DataTypes } from "sequelize";
import sequelizeInstance from "../config/sequelize";

const TaskData = sequelizeInstance.define("TaskData", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    taskHeading: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    content: {
        type: DataTypes.STRING,
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
    msgId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    freezeTableName: true,
    timestamps: true,
}
);

export default TaskData;
