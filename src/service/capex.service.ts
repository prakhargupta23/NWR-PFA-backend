import sequelize from "../config/sequelize";
import { QueryTypes } from "sequelize";

export const getLatestCapexData = async () => {
    const zonalQuery = `
   SELECT *
FROM ZonalData
WHERE selectedMonthYear = (
    SELECT TOP 1 selectedMonthYear
    FROM ZonalData
    ORDER BY TRY_CONVERT(DATE, '01/' + selectedMonthYear, 103) DESC
);
    `;

    const unitQuery = `
        SELECT *
FROM UnitData
WHERE selectedMonthYear = (
    SELECT TOP 1 selectedMonthYear
    FROM UnitData
    ORDER BY TRY_CONVERT(DATE, '01/' + selectedMonthYear, 103) DESC
);
    `;

    console.log("Fetching latest Capex data...");

    const [zonalData, unitData] = await Promise.all([
        sequelize.query(zonalQuery, { type: QueryTypes.SELECT }),
        sequelize.query(unitQuery, { type: QueryTypes.SELECT })
    ]);

    console.log(`Fetched ${zonalData.length} zonal records and ${unitData.length} unit records.`);

    return {
        zonalData,
        unitData
    };
};
