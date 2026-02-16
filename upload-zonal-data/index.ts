import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { createZonalEntry } from "../src/service/zonal.service";

const jwt = require("jsonwebtoken");

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  if (req.method === "OPTIONS") {
    context.res = {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    };
    return;
  }
  try {
    console.log("we have reached here this is body");
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Splits "Bearer TOKEN"

    const username = req.body.username;
    // console.log("username", username,req.body);

    // if (!token) {
    //   context.res = {
    //     status: 401,
    //     body: "No token provided",
    //   };
    //   return;
    // }

    // let decoded = {};

    // try {
    //   decoded = jwt.verify(token, process.env.secret);
    // } catch (error) {
    //   context.res = {
    //     status: 401,
    //     body: { error: "Invalid or expired token" },
    //   };
    //   return;
    // }
    // console.log(req.body, "this is body");

    // Call the insertData function
    const result = await createZonalEntry(req.body.data);
    // UploadDataLog(username,"Success",req.body.data.selectedMonthYear,req.body.data.division);
    context.res = {
      status: 200,
      body: result,
    };
  } catch (error) {
    // Handle errors and return response
    const username = req.body.username;
    // UploadDataLog(username,"Failure",req.body.data.selectedMonthYear,req.body.data.division);
    context.res = {
      status: 500,
      body: { success: false, message: `Error: ${error.message}` },
    };
  }
};

export default httpTrigger;