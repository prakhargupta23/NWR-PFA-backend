import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { insertOweUploadData } from "../src/service/oweupload.service";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    console.log("OWE upload function reached");

    const body = req.body || {};
    const grossEarningsCount = Array.isArray(body.grossEarnings)
      ? body.grossEarnings.length
      : 0;
    const workingExpensesCount = Array.isArray(body.workingExpenses)
      ? body.workingExpenses.length
      : 0;

    console.log(
      "OWE payload summary:",
      JSON.stringify({
        division: body.division ?? null,
        selectedMonthYear: body.selectedMonthYear ?? null,
        grossEarningsCount,
        workingExpensesCount,
      })
    );

    if (grossEarningsCount === 0 && workingExpensesCount === 0) {
      context.res = {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          success: false,
          message:
            "Parsed payload has no rows. Check Excel sheet/header mapping before upload.",
          data: {
            division: body.division ?? null,
            selectedMonthYear: body.selectedMonthYear ?? null,
            grossEarningsCount,
            workingExpensesCount,
          },
        },
      };
      return;
    }

    const result = await insertOweUploadData(body);

    context.res = {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: result,
    };
  } catch (error: any) {
    context.res = {
      status: 500,
      body: {
        success: false,
        message: `Error: ${error.message}`,
      },
    };
  }
};

export default httpTrigger;
