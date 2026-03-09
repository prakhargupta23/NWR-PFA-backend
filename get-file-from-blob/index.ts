import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { getFileFromBlob } from "../src/service/blob.service";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {

    try {
        console.log("Get file function reached");

        const doctype = req.query.doctype || (req.body && req.body.doctype);
        const date = req.query.date || (req.body && req.body.date);

        console.log("Request details:", { doctype, date });

        if (!doctype || !date) {
            context.res = {
                status: 400,
                body: {
                    success: false,
                    message: "Please provide doctype and date"
                }
            };
            return;
        }

        const filename = `${doctype}_${date}.xlsx`;
        
        const buffer = await getFileFromBlob(filename);

        context.res = {
            status: 200,
            body: buffer,
            headers: {
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        };

    } catch (error) {
        console.error("Download error:", error);
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
