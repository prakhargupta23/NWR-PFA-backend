import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getUniqueZonalMonths } from "../src/service/zonalMonths.service";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        console.log("get-zonal-months API reached");

        const months = await getUniqueZonalMonths();

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: { months },
        };
    } catch (error: any) {
        console.error("get-zonal-months API Error:", error);

        context.res = {
            status: 500,
            body: {
                error: "Failed to fetch unique months from ZonalData",
                details: error.message,
            },
        };
    }
};

export default httpTrigger;
