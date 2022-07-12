const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const v8    = require("v8");
const fs    = require("fs");
const s3Client = new S3Client({ region: "eu-west-1" });

exports.lambda_handler = async function lambda_handler(event, context) {

    console.log("allocating array");

    Array(1e6).fill("hello");

    console.log("Done allocating array");
    
    var startMem = process.memoryUsage();
    console.log("used: " + (startMem.heapUsed / 1048576) + "MB");
    console.log("external: " + (startMem.external / 1048576) + "MB");
    console.log("arrayBuffers: " + (startMem.arrayBuffers / 1048576) + "MB");

    console.log("Heap space stats = ", v8.getHeapSpaceStatistics());
    console.log("Heap code stats heapdump = ", v8.getHeapCodeStatistics());
    console.log("Heap stats = ", v8.getHeapStatistics());

    console.log("Getting heapdump...");

    // Saving locally before sending
    const snapshotStream = v8.writeHeapSnapshot("/tmp/snapshot");

    // write file to s3
    const params = {
        Bucket: "_CHANGE_BUCKET_NAME_", // The name of the bucket. For example, 'sample_bucket_101'.
        Key: "snapshot.json", 
        Body: fs.readFileSync("/tmp/snapshot"), // The content of the object. For example, 'Hello world!".
    };
    
    try {
        const data = await s3Client.send(new PutObjectCommand(params));
        console.log("uploaded");
    } catch (err) {
        return console.log("There was an error uploading : ", err.message);
    }

}


