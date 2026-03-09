import { BlobServiceClient } from "@azure/storage-blob";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const containerName = "pfa-uploads";

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

export const uploadFileToBlob = async (
    fileName: string,
    fileBuffer: Buffer
) => {

    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    console.log("🚀 Upload started");
    console.log("File:", fileName);
    console.log("Size:", fileBuffer.length, "bytes");

    const uploadResponse = await blockBlobClient.uploadData(fileBuffer, {

        onProgress: (progress) => {
            console.log(`📤 Uploaded ${progress.loadedBytes} bytes`);
        }

    });

    console.log("✅ Upload completed");
    console.log("Blob URL:", blockBlobClient.url);
    console.log("Request ID:", uploadResponse.requestId);

    return {
        url: blockBlobClient.url,
        requestId: uploadResponse.requestId
    };
};

export const getFileFromBlob = async (fileName: string) => {
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    
    console.log("🚀 Download started");
    console.log("File:", fileName);

    const buffer = await blockBlobClient.downloadToBuffer();

    console.log("✅ Download completed");
    console.log("Size:", buffer.length, "bytes");

    return buffer;
};