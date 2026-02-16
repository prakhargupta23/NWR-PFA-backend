import Task from "../Model/Task.model";
import sequelize from "../config/sequelize";

export async function taskDataInsert(taskData: any) {
    const transaction = await sequelize.transaction();
    try {
        await Task.sync({ alter: true });

        const newTask = await Task.create(
            {
                createdby: taskData.createdby || taskData.createdBy,
                status: taskData.status,
                taskheading: taskData.taskheading || taskData.taskHeading,
                content: taskData.content,
                segment: taskData.segment,
                division: taskData.division,
                type: taskData.type,
            },
            { transaction }
        );

        await transaction.commit();

        return {
            success: true,
            message: "Task created successfully",
            data: newTask,
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Error in taskDataInsert:", error);
        throw error;
    }
}

export async function getTaskData() {
    try {
        const tasks = await Task.findAll({
            raw: true,
            order: [["createdAt", "DESC"]],
        });

        return {
            success: true,
            message: "Tasks retrieved successfully",
            data: tasks,
        };
    } catch (error) {
        console.error("Error in getTaskData:", error);
        throw error;

    }
}
