


import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getDashboardData } from "../src/service/dashboard.service";

const monthNameToNumber: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

const parseMonth = (monthValue: unknown): number | null => {
  if (monthValue === null || monthValue === undefined) {
    return null;
  }

  const raw = String(monthValue).trim().toLowerCase();
  if (!raw) {
    return null;
  }

  if (/^\d{1,2}$/.test(raw)) {
    const parsed = Number(raw);
    return parsed >= 1 && parsed <= 12 ? parsed : null;
  }

  return monthNameToNumber[raw] ?? null;
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    console.log("Dashboard API reached");

    // Get month and year from frontend
    const month = req.body?.month;
    const year = req.body?.year;

    if (!month || !year) {
      context.res = {
        status: 400,
        body: { error: "month and year are required" }
      };
      return;
    }

    const monthNumber = parseMonth(month);
    if (!monthNumber) {
      context.res = {
        status: 400,
        body: { error: "Invalid month. Use 1-12 or full month name." }
      };
      return;
    }

    // Convert to MM/YYYY format
    const formattedMonth = monthNumber.toString().padStart(2, "0");
    const selectedMonthYear = `${formattedMonth}/${year}`;

    // Call service
    const data = await getDashboardData(selectedMonthYear);

    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: data
    };

  } catch (error: any) {
    console.error("Dashboard API Error:", error);

    context.res = {
      status: 500,
      body: {
        error: "Failed to fetch dashboard data",
        details: error.message
      }
    };
  }
};

export default httpTrigger;
