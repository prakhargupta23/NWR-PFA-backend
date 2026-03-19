import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { updateTask } from "../src/service/task.service";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    try {
        console.log("update task reached");
        const taskId = req.query.taskId || (req.body && req.body.taskId);
        const url = req.query.url || (req.body && req.body.url) || "";
        console.log("update task reached finally", taskId, url);
        if (!taskId) {
            context.res = {
                status: 400,
                body: { success: false, message: "Please provide a taskId" },
            };
            return;
        }

        const result = await updateTask(taskId, url);
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
