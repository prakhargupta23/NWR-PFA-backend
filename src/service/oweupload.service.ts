import sequelize from "../config/sequelize";
import GrossEarnings from "../Model/GrossEarnings.model";
import WorkingExpenses from "../Model/WorkingExpenses.model";

type UploadPayload = {
  grossEarnings?: Record<string, any>[];
  workingExpenses?: Record<string, any>[];
  selectedMonthYear?: string;
  division?: string;
};

const clean = (value: any) => {
  if (value === undefined) {
    return null;
  }
  return value;
};

const normalizeKey = (key: string) =>
  key.toLowerCase().replace(/[^a-z0-9]/g, "");

const buildNormalizedRow = (row: Record<string, any>) => {
  const normalized: Record<string, any> = {};
  Object.entries(row || {}).forEach(([key, value]) => {
    normalized[normalizeKey(key)] = value;
  });
  return normalized;
};

const readField = (
  row: Record<string, any>,
  normalizedRow: Record<string, any>,
  aliases: string[]
) => {
  for (const alias of aliases) {
    if (Object.prototype.hasOwnProperty.call(row, alias) && row[alias] !== undefined) {
      return row[alias];
    }
    const normalizedAlias = normalizeKey(alias);
    if (
      Object.prototype.hasOwnProperty.call(normalizedRow, normalizedAlias) &&
      normalizedRow[normalizedAlias] !== undefined
    ) {
      return normalizedRow[normalizedAlias];
    }
  }
  return undefined;
};

const extractYear = (value: unknown): number | null => {
  const match = String(value ?? "").match(/(19|20)\d{2}/);
  return match ? Number(match[0]) : null;
};

const readDynamicActualToEndValue = (
  normalizedRow: Record<string, any>,
  targetYear: number | null
) => {
  if (!targetYear) {
    return undefined;
  }

  const yearSuffix = String(targetYear);
  const keys = Object.keys(normalizedRow);

  const matchingKey = keys.find(
    (key) => key.startsWith("actualtoendof") && key.endsWith(yearSuffix)
  );

  return matchingKey ? normalizedRow[matchingKey] : undefined;
};

const mapOweRow = (row: Record<string, any>, payload: UploadPayload) => {
  const normalizedRow = buildNormalizedRow(row);
  const selectedYear = extractYear(payload.selectedMonthYear);
  const previousYear = selectedYear ? selectedYear - 1 : null;

  const explicitActualCurrent = readField(row, normalizedRow, [
    "actualToEndCurrentYear",
    "actualToDateCurrentYear",
  ]);

  const explicitActualLastYear = readField(row, normalizedRow, [
    "actualToEndLastYear",
    "actualToDateLastYear",
  ]);

  const dynamicActualCurrent = readDynamicActualToEndValue(
    normalizedRow,
    selectedYear
  );

  const dynamicActualLastYear = readDynamicActualToEndValue(
    normalizedRow,
    previousYear
  );

  return {
    division: clean(
      readField(row, normalizedRow, ["division"]) ?? payload.division
    ),
    date: clean(readField(row, normalizedRow, ["date", "month", "period"])),
    figure: clean(readField(row, normalizedRow, ["figure", "unit"])),
    sno: clean(readField(row, normalizedRow, ["sno", "srNo", "serialNo"])),
    category: clean(
      readField(row, normalizedRow, ["category", "head", "particulars"])
    ),
    actualLastFY: clean(
      readField(row, normalizedRow, [
        "actualLastFY",
        "actualLastYear",
        "actualToEndLastYear",
      ])
    ),
    obg: clean(readField(row, normalizedRow, ["obg"])),
    rbg: clean(readField(row, normalizedRow, ["rbg"])),
    bpToEndMonth: clean(
      readField(row, normalizedRow, ["bpToEndMonth", "bpToEndOfMonth"])
    ),
    actualForMonth: clean(
      readField(row, normalizedRow, ["actualForMonth", "actualMonth"])
    ),
    actualToEndCurrentYear: clean(
      explicitActualCurrent ?? dynamicActualCurrent
    ),
    actualToEndLastYear: clean(
      explicitActualLastYear ?? dynamicActualLastYear
    ),
    diffActualVsBP: clean(
      readField(row, normalizedRow, ["diffActualVsBP", "differenceActualVsBP"])
    ),
    diffCurrentVsLastYear: clean(
      readField(row, normalizedRow, [
        "diffCurrentVsLastYear",
        "differenceCurrentVsLastYear",
      ])
    ),
    percentVariationBP: clean(
      readField(row, normalizedRow, ["percentVariationBP", "percentageVariationBP"])
    ),
    percentVariationLastYear: clean(
      readField(row, normalizedRow, [
        "percentVariationLastYear",
        "percentageVariationLastYear",
      ])
    ),
    selectedMonthYear: clean(payload.selectedMonthYear),
  };
};

export async function insertOweUploadData(payload: UploadPayload) {
  console.log("Raw OWE payload receiving");
  console.log(JSON.stringify(payload, null, 2));
  console.log("End OWE payload");

  const transaction = await sequelize.transaction();

  try {
    await GrossEarnings.sync();
    await WorkingExpenses.sync();

    const earningsRows = Array.isArray(payload.grossEarnings)
      ? payload.grossEarnings
      : [];

    const expenseRows = Array.isArray(payload.workingExpenses)
      ? payload.workingExpenses
      : [];

    if (earningsRows.length === 0 && expenseRows.length === 0) {
      throw new Error(
        "No data provided. grossEarnings or workingExpenses is required."
      );
    }

    // Gross Earnings Mapping
    const earningsInsertPayload = earningsRows.map((row) => mapOweRow(row, payload));

    // Working Expenses Mapping
    const expensesInsertPayload = expenseRows.map((row) => mapOweRow(row, payload));

    // 🔥 Optional: Delete Existing Month Data (Prevent Duplicate)
    if (payload.selectedMonthYear && payload.division) {
      await GrossEarnings.destroy({
        where: {
          division: payload.division,
          selectedMonthYear: payload.selectedMonthYear,
        },
        transaction,
      });

      await WorkingExpenses.destroy({
        where: {
          division: payload.division,
          selectedMonthYear: payload.selectedMonthYear,
        },
        transaction,
      });
    }

    // 🔹 Insert Earnings
    if (earningsInsertPayload.length > 0) {
      await GrossEarnings.bulkCreate(earningsInsertPayload, {
        transaction,
        returning: false,
      });
    }

    // 🔹 Insert Expenses
    if (expensesInsertPayload.length > 0) {
      await WorkingExpenses.bulkCreate(expensesInsertPayload, {
        transaction,
        returning: false,
      });
    }

    await transaction.commit();

    return {
      success: true,
      message: "OWE upload data inserted successfully",
      data: {
        division: payload.division ?? null,
        selectedMonthYear: payload.selectedMonthYear ?? null,
        earningsInserted: earningsInsertPayload.length,
        expensesInserted: expensesInsertPayload.length,
      },
    };
  } catch (error: any) {
    await transaction.rollback();

    console.error("Error in insertOweUploadData:", error);

    if (error?.parent?.errors && Array.isArray(error.parent.errors)) {
      console.error(
        "DB request errors:",
        error.parent.errors.map((e: any) => e.message)
      );
    }

    throw error;
  }
}
