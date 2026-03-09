import sequelize from "../config/sequelize";
import { QueryTypes } from "sequelize";

export const getLatestCapexData = async () => {
    const zonalQuery = `
        SELECT *
        FROM ZonalData
        WHERE createdAt = (
            SELECT MAX(createdAt)
            FROM ZonalData
        );
    `;

    const unitQuery = `
        SELECT *
        FROM UnitData
        WHERE createdAt = (
            SELECT MAX(createdAt)
            FROM UnitData
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
