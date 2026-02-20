import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { insertZonalUploadData } from "../src/service/zonalupload.service";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        console.log("Zonal upload function reached");
        const body = req.body || {};
        const result = await insertZonalUploadData(body);

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
            body: result,
        };
    } catch (error) {
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
