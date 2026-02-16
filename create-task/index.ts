import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { taskDataInsert } from "../src/service/task.service";



const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {

    const result = await taskDataInsert(req.body);
    context.res = {
      status: 200,
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
