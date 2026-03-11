import { getLatestCapexData } from "./capex.service";
import { getLatestAuditData } from "./audit.service";
import { getLatestOweData } from "./owe.service";
import { getLatestEarningsData, getLatestWorkingExpensesData } from "./grossEarningsMonths.service";


export const getDashboardData = async () => {
    console.log("Dashboard data function reached");
    const capexData = await getLatestCapexData();
    const oweData = await getLatestOweData();
    const auditData = await getLatestAuditData();
    console.log("gggggg");
    const workingExpensesData = await getLatestWorkingExpensesData();
    const workingExpenses = filterWorkingExpenses(workingExpensesData);
    const operatingRatio = filterOperatingRatio(workingExpensesData);


    const earningsData = await getLatestEarningsData();
    const Earnings = filterEarningsData(earningsData);

    console.log("Earnings", Earnings);
    console.log("workingExpenses", workingExpenses);
    console.log("operatingRatio", operatingRatio);

    return {
        capexData,
        oweData,
        auditData,
        operatingRatio,
        Earnings,
        workingExpenses
    };
};


async function filterEarningsData(earningsData: any) {
    const data = earningsData;
    console.log("earnings data");
    const grossEarningsRow = data?.sortedAuditData?.find((row: any) => row.category === "Gross Earnings");
    return grossEarningsRow ? grossEarningsRow.percentVariationBP : null;
}


async function filterWorkingExpenses(workingExpensesData: any) {
    const data = workingExpensesData;
    console.log("working expenses data");
    const grossEarningsRow = data?.sortedAuditData?.find((row: any) => row.category === "Total");
    return grossEarningsRow ? grossEarningsRow.percentVariationBP : null;
}

async function filterOperatingRatio(workingExpensesData: any) {
    const data = workingExpensesData;
    console.log("operating ratio data");
    const grossEarningsRow = data?.sortedAuditData?.find((row: any) => row.category === "Operating Ratio");
    return grossEarningsRow ? grossEarningsRow.actualToEndLastYear : null;
}
