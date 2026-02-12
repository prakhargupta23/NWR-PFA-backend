const sequelize = require("../config/sequlize");
const TaskData = require("../Model/Task.model").default;

// Helper function to get current date and time
const getCurrentDateTime = (): string => {
    const now = new Date();
    // Simple format: YYYY-MM-DD HH:MM:SS
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export async function taskDataInsert(
    processedData: any,
): Promise<any> {
    console.log("Saving task data to the database...");
    const transaction = await sequelize.transaction();
    try {
        const dataToInsert = {
            msgId: processedData?.msgId ?? null,
            taskHeading: processedData?.taskHeading ?? null,
            content: processedData?.content ?? null,
            segment: processedData?.segment ?? null,
            division: processedData?.division ?? null,
            type: processedData?.type ?? null,
            status: processedData?.status ?? null,
            createdBy: processedData?.createdBy ?? null,
        };
        console.log("Data to insert:", dataToInsert);

        const flowRow = await TaskData.create(dataToInsert, { transaction });
        console.log("Committing transaction...");

        await transaction.commit();
        console.log("Task data successfully saved to the database.", flowRow);
        return {
            saved: true,
            caseUuid: (flowRow as any).uuid,
        };
    } catch (Error: any) {
        await transaction.rollback();
        console.error("Error Message:", Error);
        console.error("Rolling back transaction...");
        return {
            saved: false,
            error: Error?.message || "Failed to save task data",
        };
    }
}


export async function getTaskData(): Promise<any> {
    console.log("Fetching task data from the database...");
    try {
        // Build filter object - only include fields that are provided
        // const whereClause: any = {};

        // if (processedData?.msgId) whereClause.msgId = processedData.msgId;
        // if (processedData?.taskHeading) whereClause.taskHeading = processedData.taskHeading;
        // if (processedData?.segment) whereClause.segment = processedData.segment;
        // if (processedData?.division) whereClause.division = processedData.division;
        // if (processedData?.type) whereClause.type = processedData.type;
        // if (processedData?.status) whereClause.status = processedData.status;
        // if (processedData?.createdBy) whereClause.createdBy = processedData.createdBy;
        // if (processedData?.uuid) whereClause.uuid = processedData.uuid;

        // Fetch data from TaskData table
        const taskData = await TaskData.findAll({
            // where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
            order: [['createdAt', 'DESC']], // Most recent first
        });

        console.log(`Found ${taskData.length} task records.`);
        return {
            success: true,
            count: taskData.length,
            data: taskData,
        };
    } catch (Error: any) {
        console.error("Error fetching task data:", Error);
        return {
            success: false,
            error: Error?.message || "Failed to fetch task data",
        };
    }
}
