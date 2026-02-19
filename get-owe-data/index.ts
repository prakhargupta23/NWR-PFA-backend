import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getOweDashboardData } from "../src/service/oweDashboard.service";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    const rawBody =
      typeof req.body === "string"
        ? (() => {
            try {
              return JSON.parse(req.body);
            } catch {
              return {};
            }
          })()
        : req.body || {};

    const query = req.query || {};

    const selectedMonthYear =
      rawBody.selectedMonthYear ??
      rawBody.monthYear ??
      rawBody.selectedMonth ??
      rawBody.selectedDate ??
      query.selectedMonthYear ??
      query.monthYear ??
      query.selectedMonth ??
      query.selectedDate;

    const division =
      rawBody.division ??
      rawBody.divisionName ??
      rawBody.zone ??
      rawBody.railway ??
      query.division ??
      query.divisionName ??
      query.zone ??
      query.railway;

    if (!selectedMonthYear || !division) {
      context.res = {
        status: 400,
        body: {
          success: false,
          message:
            "selectedMonthYear and division are required in body or query",
          data: {
            receivedKeys: Object.keys(rawBody),
            receivedQueryKeys: Object.keys(query),
          },
        },
      };
      return;
    }

    const result = await getOweDashboardData({
      selectedMonthYear: String(selectedMonthYear).trim(),
      division: String(division).trim(),
    });

    context.res = {
      status: 200,
      body: result,
    };
  } catch (error: any) {
    console.error("get-owe-data failed:", error);
    context.res = {
      status: 500,
      body: {
        success: false,
        message: error.message,
      },
    };
  }
};

export default httpTrigger;
