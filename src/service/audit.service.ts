import sequelize from "../config/sequelize";
import { QueryTypes } from "sequelize";

export const getUniqueAuditMonths = async (): Promise<string[]> => {
    const rows = await sequelize.query<{ selectedMonthYear: string }>(
        `SELECT DISTINCT selectedMonthYear FROM AuditData WHERE selectedMonthYear IS NOT NULL`,
        { type: QueryTypes.SELECT }
    );

    const months = rows
        .map((r) => r.selectedMonthYear)
        .filter(Boolean);

    // Sort descending: parse MM/YYYY → comparable number YYYY * 100 + MM
    months.sort((a, b) => {
        const toNum = (val: string): number => {
            const [mm, yyyy] = val.split("/");
            return Number(yyyy) * 100 + Number(mm);
        };
        return toNum(b) - toNum(a);
    });

    return months;
};


export const getLatestAuditData = async () => {
    const AuditDataQuery = `
        SELECT *
        FROM AuditData
        WHERE createdAt = (
            SELECT MAX(createdAt)
            FROM AuditData
        );
    `;

    console.log("Fetching latest Audit data from AuditData...");

    const AuditData = await sequelize.query(AuditDataQuery, { type: QueryTypes.SELECT });

    const sortedAuditData = AuditData.sort((a, b) => a['index'] - b['index']);

    console.log(`Fetched ${sortedAuditData.length} Audit records.`);

    return {
        sortedAuditData
    };
};

