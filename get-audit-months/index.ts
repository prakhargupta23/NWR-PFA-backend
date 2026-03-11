import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getUniqueAuditMonths } from "../src/service/audit.service";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        console.log("Get Audit months function reached");

        const months = await getUniqueAuditMonths();

        context.res = {
            status: 200,
            body: {
                success: true,
                data: months
            }
        };

    } catch (error) {
        console.error("Error fetching Audit months:", error);
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
