import ZonalData from "../Model/ZonalData.model";
import UnitData from "../Model/UnitData.model";
import GrossEarnings from "../Model/GrossEarnings.model";
import { Op } from "sequelize";

const parseAmount = (value: unknown): number => {
  if (value === null || value === undefined) {
    return 0;
  }

  const cleaned = String(value).replace(/[^0-9.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toTwoDecimals = (value: unknown): number =>
  Number(parseAmount(value).toFixed(2));

const normalizeLabel = (value: unknown): string =>
  String(value ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

const DIVISION_ORDER = ["JODHPUR", "BIKANER", "AJMER", "JAIPUR"] as const;

const normalizeDivision = (value: unknown): string =>
  String(value ?? "").trim().toUpperCase().replace(/\s+/g, " ");

const isGrossEarningsRow = (row: any): boolean =>
  normalizeLabel(row?.category) === "grossearnings";

const getPreviousMonthYear = (selectedMonthYear: string): string | null => {
  const match = String(selectedMonthYear).match(/^(\d{1,2})\/(\d{4})$/);
  if (!match) {
    return null;
  }

  const month = Number(match[1]);
  const year = Number(match[2]);

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }

  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;

  return `${String(previousMonth).padStart(2, "0")}/${previousYear}`;
};

export async function getDashboardData(selectedMonthYear: string) {
  const previousMonthYear = getPreviousMonthYear(selectedMonthYear);

  
  const zonalGrandTotal = await ZonalData.findOne({
    where: {
      planheadname: "Grand Total",
      selectedMonthYear
    }
  });

  const unitTotals = await UnitData.findAll({
    where: {
      planheadname: "TOTAL",
      selectedMonthYear
    }
  });

  const grossRows = previousMonthYear
    ? await GrossEarnings.findAll({
        where: {
          selectedMonthYear: {
            [Op.in]: [selectedMonthYear, previousMonthYear],
          },
        },
        raw: true,
      })
    : [];

  const currentGrossRow = grossRows.find(
    (row: any) =>
      row.selectedMonthYear === selectedMonthYear &&
      isGrossEarningsRow(row)
  );

  const previousGrossRow = grossRows.find(
    (row: any) =>
      row.selectedMonthYear === previousMonthYear &&
      isGrossEarningsRow(row)
  );

  const currentGrossTotal = parseAmount((currentGrossRow as any)?.actualToEndCurrentYear);
  const previousGrossTotal = parseAmount((previousGrossRow as any)?.actualToEndCurrentYear);

  const earningsGrowth =
    previousGrossTotal > 0
      ? Number((((currentGrossTotal - previousGrossTotal) / previousGrossTotal) * 100).toFixed(2))
      : 0;

  const unitRows = unitTotals.map((row: any) => {
    const divisionName = normalizeDivision(row.au ?? row.auunder ?? row.division);
    return {
      divisionName,
      value: toTwoDecimals(row.percentageutilization),
    };
  });

  const valueByDivision = new Map<string, number>();
  for (const row of unitRows) {
    if (!row.divisionName) {
      continue;
    }
    valueByDivision.set(row.divisionName, row.value);
  }

  const orderedKnownDivisions = DIVISION_ORDER.map((divisionName) => ({
    auunder: divisionName,
    value: valueByDivision.get(divisionName) ?? 0,
  }));

  const extraDivisions = Array.from(valueByDivision.entries())
    .filter(([divisionName]) => !DIVISION_ORDER.includes(divisionName as any))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([divisionName, value]) => ({
      auunder: divisionName,
      value,
    }));

  return {
    utilization: toTwoDecimals((zonalGrandTotal as any)?.utilizationoftotal),
    earningsGrowth,
    earningsGrowthMeta: {
      selectedMonthYear,
      comparedWith: previousMonthYear,
      currentGrossEarnings: currentGrossTotal,
      previousGrossEarnings: previousGrossTotal,
      sourceTable: "GrossEarnings",
      sourceRow: "Gross earnings",
      sourceColumn: "actualToEndCurrentYear",
    },

    graphData: [...orderedKnownDivisions, ...extraDivisions]
  };
}
