import Task from "../Model/Task.model";
import sequelize from "../config/sequelize";

export async function taskDataInsert(taskData: any) {
    const transaction = await sequelize.transaction();
    try {
        await Task.sync({ alter: true });

        const newTask = await Task.create(
            {
                uuid: taskData.uuid ?? undefined,
                taskId: taskData.taskId ?? null,
                msgId: taskData.msgId ?? null,

                createdby: taskData.createdby ?? taskData.createdBy ?? null,
                assignedTo: taskData.assignedTo ?? taskData.assignedto ?? null,

                status: taskData.status ?? "Pending",

                taskheading: taskData.taskheading ?? taskData.taskHeading ?? null,

                content: taskData.content ?? null,
                segment: taskData.segment ?? null,
                division: taskData.division ?? null,
                type: taskData.type ?? null
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


export async function updateTask(taskId: string) {
    const transaction = await sequelize.transaction();
    try {
        const task = await Task.findOne({
            where: { taskId },
            transaction,
        });

        if (!task) {
            await transaction.rollback();
            return {
                success: false,
                message: "Task not found",
            };
        }

        task.status = "Completed";
        await task.save({ transaction });

        await transaction.commit();

        return {
            success: true,
            message: "Task updated successfully",
            data: task,
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Error in updateTask:", error);
        throw error;
    }
}



