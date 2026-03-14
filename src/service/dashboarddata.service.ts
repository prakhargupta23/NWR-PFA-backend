import { getLatestCapexData } from "./capex.service";
import { getLatestAuditData } from "./audit.service";
import { getLatestOweData } from "./owe.service";
import { getLatestEarningsData, getLatestWorkingExpensesData } from "./grossEarningsMonths.service";


const DIVISION_ORDER = ["JODHPUR", "BIKANER", "AJMER", "JAIPUR"];

export const getDashboardData = async () => {
    console.log("Dashboard data function reached");
    const capexData = await getLatestCapexData();
    const capex = filterCapexData(capexData);
    console.log("capex", capex);

    const auditData = await getLatestAuditData();
    const audit = filterAuditData(auditData);
    console.log("audit", audit);

    const workingExpensesData = await getLatestWorkingExpensesData();
    const workingExpenses = filterWorkingExpenses(workingExpensesData);
    const operatingRatio = filterOperatingRatio(workingExpensesData);

    const earningsData = await getLatestEarningsData();
    const Earnings = filterEarningsData(earningsData);

    // Prepare graphData from unitData
    const unitData: any[] = capexData?.unitData || [];
    const graphData = DIVISION_ORDER.map(divName => {
        const row = unitData.find((r: any) => 
            (r.au || r.auunder || r.division || "").toUpperCase().includes(divName)
        );
        return {
            name: divName,
            value: row ? (Number(row.percentageutilization) || 0) : 0
        };
    });

    console.log("Earnings", Earnings);
    console.log("workingExpenses", workingExpenses);
    console.log("operatingRatio", operatingRatio);

    return {
        operatingRatio,
        Earnings,
        workingExpenses,
        capex,
        audit,
        graphData
    };
};


function filterAuditData(auditData: any) {
    const data = auditData?.sortedAuditData || [];
    const filteredrow = data.find((row: any) => row.category === "Total");
    console.log("filteredrow audit", filteredrow);
    return filteredrow?.percentVariationBP || null;
}

function filterCapexData(capexData: any) {
    const data = capexData?.zonalData || [];
    const filteredrow = data.find((row: any) => row.planheadname === "Grand Total");
    console.log("filteredrow capex", filteredrow);
    return filteredrow?.total || null;
}

function filterEarningsData(earningsData: any) {
    const data = earningsData?.sortedEarningsData || [];
    console.log("earnings data filter");
    const grossEarningsRow = data.find((row: any) => row.category === "Gross Earnings");
    return grossEarningsRow ? grossEarningsRow.percentVariationBP : null;
}

function filterWorkingExpenses(workingExpensesData: any) {
    const data = workingExpensesData?.sortedWorkingExpensesData || [];
    console.log("working expenses data filter");
    const grossEarningsRow = data.find((row: any) => row.category === "Total");
    return grossEarningsRow ? grossEarningsRow.percentVariationBP : null;
}

function filterOperatingRatio(workingExpensesData: any) {
    const data = workingExpensesData?.sortedWorkingExpensesData || [];
    console.log("operating ratio data filter");
    const grossEarningsRow = data.find((row: any) => row.category === "Operating Ratio");
    return grossEarningsRow ? grossEarningsRow.actualToEndLastYear : null;
}
