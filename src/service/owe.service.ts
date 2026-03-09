import sequelize from "../config/sequelize";
import { QueryTypes } from "sequelize";

export const getLatestOweData = async () => {
    const oweQuery = `
        SELECT *
        FROM WorkingExpenses
        WHERE createdAt = (
            SELECT MAX(createdAt)
            FROM WorkingExpenses
        );
    `;

    console.log("Fetching latest OWE data from WorkingExpenses...");

    const oweData = await sequelize.query(oweQuery, { type: QueryTypes.SELECT });

    console.log(`Fetched ${oweData.length} owe records.`);

    return {
        oweData
    };
};
