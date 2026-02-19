import { getGpt4oResponse } from "./ai.service";
import sequelize from "../config/sequelize";
import axios from 'axios';


export async function getfiledata(prompt: string, file: string) {
    try {
        console.log("ocr reached",file[0]?"yes":"no");


      
        let extractedText = "";
        try {
          const response = await axios.post('https://ocrappnwrsup-bwhhbsenaeb8gqdm.canadacentral-01.azurewebsites.net/ocr', {
            pdfBase64: file
          });
          extractedText = response.data.text;
          console.log("Extracted text:", response.data.text);

        } catch (error) {
          console.error("OCR Error:", error.response?.data || error.message);
        }
        
        
        
        const jsonPrompt = `${prompt} 

              Return only valid JSON.
              The document given to you will be the extracted text using ocr and might not be properly structured but the keep the values same and process accordingly(consider ] as a distinction between columns if it is in a table row)
              Document:
              ${extractedText}`;
        const gptResponse = await getGpt4oResponse(jsonPrompt, { extractedText });
        


return gptResponse;


    } catch (error) {
        console.error("Error in getfiledata:", error);
        throw error;
    }
}




