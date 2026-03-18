import { randomUUID } from "crypto";
import Task from "../Model/Task.model";
import sequelize from "../config/sequelize";
import Summary from "../Model/Summary";

export async function taskDataInsert(taskData: any) {
    const transaction = await sequelize.transaction();
    try {
        await Task.sync({ alter: true });
        console.log("taskData", taskData);
        const newTask = await Task.create(
            {
                uuid: taskData.uuid ?? randomUUID(),
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
        console.log("newTask", newTask);

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


export async function updateTask(taskId: string, url: string) {
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
        task.url = url;
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


export async function updateSummary(taskData: any) {
    const transaction = await sequelize.transaction();
    try {
        console.log("taskData", taskData);
        const newSummary = await Summary.create(
            {
                uuid: taskData.uuid ?? randomUUID(),
                content: taskData.content ?? null,
                type: taskData.type ?? null,
                date: taskData.date ?? null
            },
            { transaction }
        );
        console.log("summary", newSummary);

        await transaction.commit();

        return {
            success: true,
            message: "Summary saved successfully",
            data: newSummary,
        };
    } catch (error) {
        await transaction.rollback();
        console.error("Error in summary:", error);
        throw error;
    }
}


export async function getLatestSummariesByTypes() {
    try {
        const summaries = await Summary.findAll({
            where: {
                type: ["capex", "owe", "audit"]
            },
            raw: true
        });

        const latestPerType: any = {};

        const toNum = (val: string): number => {
            if (!val || !val.includes("/")) return 0;
            const parts = val.split("/");
            if (parts.length !== 2) return 0;
            const [mm, yyyy] = parts;
            return Number(yyyy) * 100 + Number(mm);
        };

        summaries.forEach((s: any) => {
            const currentLatest = latestPerType[s.type];
            if (!currentLatest) {
                latestPerType[s.type] = s;
                return;
            }

            const sDateVal = toNum(s.date);
            const currentLatestDateVal = toNum(currentLatest.date);

            if (sDateVal > currentLatestDateVal) {
                latestPerType[s.type] = s;
            } else if (sDateVal === currentLatestDateVal) {
                if (new Date(s.createdAt) > new Date(currentLatest.createdAt)) {
                    latestPerType[s.type] = s;
                }
            }
        });

        return {
            success: true,
            message: "Latest summaries retrieved successfully",
            data: latestPerType
        };
    } catch (error) {
        console.error("Error in getLatestSummariesByTypes:", error);
        throw error;
    }
}



