import WorkingExpenses from "../Model/WorkingExpenses.model";

const toTwoDecimals = (value: unknown): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return Number(parsed.toFixed(2));
};

export async function getOweDashboardData(payload: any) {
  const { selectedMonthYear, division } = payload;

  //  Fetch only SMH rows
  const rows = await WorkingExpenses.findAll({
    where: {
      selectedMonthYear,
      division,
    },
    raw: true,
  });

  //  Filter only SMH categories
  const smhRows = rows.filter((row: any) =>
    row.category?.startsWith("SMH-")
  );

  //  Format response for dashboard
  const formatted = smhRows.map((row: any) => ({
    smh: row.category,
    division: row.division,
    grant: toTwoDecimals(row.bpToEndMonth),
    actual: toTwoDecimals(row.actualToEndCurrentYear),
    variance: toTwoDecimals(row.diffActualVsBP),
    percent: toTwoDecimals(row.percentVariationBP),
  }));

  return {
    success: true,
    data: formatted,
  };
}
