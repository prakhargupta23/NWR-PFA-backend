import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getLatestSummariesByTypes } from "../src/service/task.service";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        console.log("Get Latest Summaries function triggered");

        const result = await getLatestSummariesByTypes();

        context.res = {
            status: 200,
            body: result
        };

    } catch (error) {
        console.error("Error in get-latest-summaries:", error);
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
