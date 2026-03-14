import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getDashboardData } from "../src/service/dashboarddata.service";


const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    console.log("Dashboard API reached");

    const data = await getDashboardData();

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
