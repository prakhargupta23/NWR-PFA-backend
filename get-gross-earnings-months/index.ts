import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getUniqueGrossEarningsMonths } from "../src/service/grossEarningsMonths.service";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        console.log("get-gross-earnings-months API reached");

        const months = await getUniqueGrossEarningsMonths();

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: { months },
        };
    } catch (error: any) {
        console.error("get-gross-earnings-months API Error:", error);

        context.res = {
            status: 500,
            body: {
                error: "Failed to fetch unique months from GrossEarnings",
                details: error.message,
            },
        };
    }
};

export default httpTrigger;
