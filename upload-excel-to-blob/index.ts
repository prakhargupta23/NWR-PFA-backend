import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { uploadFileToBlob } from "../src/service/blob.service";

const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {

    try {

        console.log("blob function reached");

        const [docname, date, base64] = req.body;

        console.log("blob function reached 1", docname, date);

        if (!docname || !date || !base64) {
            context.res = {
                status: 400,
                body: {
                    success: false,
                    message: "Please provide docname, date, and base64"
                }
            };
            return;
        }

        console.log("blob function reached 2");

        const filename = `${docname}_${date}.xlsx`;

        console.log("blob function reached 3");

        // 🔹 Convert Base64 → Buffer
        const fileBuffer = Buffer.from(base64, "base64");

        console.log("Buffer size:", fileBuffer.length);

        const result = await uploadFileToBlob(filename, fileBuffer);

        console.log("blob function reached 4");

        context.res = {
            status: 200,
            body: result
        };

    } catch (error) {

        console.error("Upload error:", error);

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