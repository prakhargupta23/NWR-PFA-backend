import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { insertAuditUploadData } from "../src/service/auditupload.service";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        console.log("Audit upload function reached");
        const body = req.body || {};
        const result = await insertAuditUploadData(body);
        console.log("Audit upload result", result);

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
