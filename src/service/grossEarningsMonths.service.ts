import { QueryTypes } from "sequelize";
import sequelize from "../config/sequelize";

/**
 * Returns a sorted list of unique months (MM/YYYY) present in the GrossEarnings table.
 * The list is sorted in descending chronological order (most recent first).
 */
export async function getUniqueGrossEarningsMonths(): Promise<string[]> {
    const rows = await sequelize.query<{ selectedMonthYear: string }>(
        `SELECT DISTINCT selectedMonthYear FROM GrossEarnings WHERE selectedMonthYear IS NOT NULL`,
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
}



export const getLatestEarningsData = async () => {
    const EarningsDataQuery = `
        SELECT *
        FROM GrossEarnings
        WHERE createdAt = (
            SELECT MAX(createdAt)
            FROM GrossEarnings
        );
    `;

    console.log("Fetching latest GrossEarnings data from GrossEarnings...");

    const EarningsData = await sequelize.query(EarningsDataQuery, { type: QueryTypes.SELECT });

    const sortedEarningsData = EarningsData.sort((a, b) => a['sno'] - b['sno']);

    console.log(`Fetched ${sortedEarningsData.length} GrossEarnings records.`);

    return {
        sortedEarningsData
    };
};



export const getLatestWorkingExpensesData = async () => {
    const WorkingExpensesDataQuery = `
        SELECT *
        FROM WorkingExpenses
        WHERE createdAt = (
            SELECT MAX(createdAt)
            FROM WorkingExpenses
        );
    `;

    console.log("Fetching latest WorkingExpenses data from WorkingExpenses...");

    const WorkingExpensesData = await sequelize.query(WorkingExpensesDataQuery, { type: QueryTypes.SELECT });

    const sortedWorkingExpensesData = WorkingExpensesData.sort((a, b) => a['sno'] - b['sno']);

    console.log(`Fetched ${sortedWorkingExpensesData.length} WorkingExpenses records.`);

    return {
        sortedWorkingExpensesData
    };
};