import sequelize from "../config/sequelize";
import { QueryTypes } from "sequelize";

export const getLatestOweData = async () => {
    const oweQuery = `
        SELECT *
        FROM WorkingExpenses
        WHERE selectedMonthYear = (
            SELECT TOP 1 selectedMonthYear
            FROM WorkingExpenses
            ORDER BY TRY_CONVERT(DATE, '01/' + selectedMonthYear, 103) DESC
        );
    `;

    console.log("Fetching latest OWE data from WorkingExpenses...");

    const oweData = await sequelize.query(oweQuery, { type: QueryTypes.SELECT });

    console.log(`Fetched ${oweData.length} owe records.`);

    return {
        oweData
    };
};
