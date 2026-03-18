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
        WHERE selectedMonthYear = (
            SELECT TOP 1 selectedMonthYear
            FROM GrossEarnings
            ORDER BY TRY_CONVERT(DATE, '01/' + selectedMonthYear, 103) DESC
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
        WHERE selectedMonthYear = (
            SELECT TOP 1 selectedMonthYear
            FROM WorkingExpenses
            ORDER BY TRY_CONVERT(DATE, '01/' + selectedMonthYear, 103) DESC
        );
    `;

    console.log("Fetching latest WorkingExpenses data from WorkingExpenses...");

    const WorkingExpensesData = await sequelize.query(WorkingExpensesDataQuery, { type: QueryTypes.SELECT });
    console.log(`WorkingExpensesData: ${WorkingExpensesData.length} rows fetched`);
    console.log("WorkingExpensesData categories:", WorkingExpensesData.map((r: any) => r.category));

    const sortedWorkingExpensesData = WorkingExpensesData.sort((a, b) => a['sno'] - b['sno']);

    console.log(`Fetched ${sortedWorkingExpensesData.length} WorkingExpenses records.`);

    return {
        sortedWorkingExpensesData
    };
};

export const getOperatingRatioLast6Months = async () => {
    const query = `
        SELECT *
        FROM WorkingExpenses
        WHERE category = 'OPERATING RATIO (%)(Exclud.Susp.)'
    `;

    console.log("Fetching operating ratio data for the last 6 months...");

    const data: any[] = await sequelize.query(query, { type: QueryTypes.SELECT });

    // Group by selectedMonthYear, keeping the most recently created record for each month
    const latestPerMonth = new Map<string, any>();

    for (const row of data) {
        if (!row.selectedMonthYear) continue;
        const currentLatest = latestPerMonth.get(row.selectedMonthYear);
        if (!currentLatest || new Date(row.createdAt).getTime() > new Date(currentLatest.createdAt).getTime()) {
            latestPerMonth.set(row.selectedMonthYear, row);
        }
    }

    const uniqueMonthsData = Array.from(latestPerMonth.values());

    // Sort descending by month/year to easily get the latest 6 months
    uniqueMonthsData.sort((a, b) => {
        const toNum = (val: string): number => {
            if (!val) return 0;
            const [mm, yyyy] = val.split("/");
            return Number(yyyy) * 100 + Number(mm);
        };
        return toNum(b.selectedMonthYear) - toNum(a.selectedMonthYear);
    });

    const last6MonthsData = uniqueMonthsData.slice(0, 6);

    // Optionally reverse it to chronological order (oldest to newest)
    last6MonthsData.sort((a, b) => {
        const toNum = (val: string): number => {
            if (!val) return 0;
            const [mm, yyyy] = val.split("/");
            return Number(yyyy) * 100 + Number(mm);
        };
        return toNum(a.selectedMonthYear) - toNum(b.selectedMonthYear);
    });

    console.log(`Fetched ${last6MonthsData.length} operating ratio records for the last 6 months.`);

    return {
        operatingRatioLast6Months: last6MonthsData
    };
};