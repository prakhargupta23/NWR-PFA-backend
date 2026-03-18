import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { updateSummary } from "../src/service/task.service";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        console.log("Update summary data function triggered");
        // const taskId = req.query. || (req.body && req.body.taskId);
        const summary = req.query.summary || (req.body && req.body.summary);
        const param = req.query.param || (req.body && req.body.param);
        const date = req.query.date || (req.body && req.body.date);

        console.log("Summary", summary);
        console.log("Param", param);
        console.log("Date", date);

        if (!summary && !param && !date) {
            context.res = {
                status: 400,
                body: { success: false, message: "Please provide a summary" },
            };
            return;
        }

        const row = {
            content: summary,
            type: param,
            date: date,
        }

        const result = await updateSummary(row);
        context.res = {
            status: result.success ? 200 : 404,
            body: result,
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: { success: false, message: `Error: ${error.message}` },
        };
    }
};

export default httpTrigger;
