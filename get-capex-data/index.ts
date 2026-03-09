import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getLatestCapexData } from "../src/service/capex.service";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        console.log("Get Capex data function reached");

        const data = await getLatestCapexData();

        context.res = {
            status: 200,
            body: {
                success: true,
                data: data
            }
        };

    } catch (error) {
        console.error("Error fetching Capex data:", error);
        context.res = {
            status: 500,
            body: {
                success: false,
                message: `Error: ${error.message}`
            }
        };
    }
};

export default httpTrigger;
