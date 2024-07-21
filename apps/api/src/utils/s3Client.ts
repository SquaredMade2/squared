import AWS, { ConfigurationOptions } from "aws-sdk";

if (process.env.NODE_ENV === "development") {
  AWS.config.update({
    s3ForcePathStyle: true,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: new AWS.Endpoint("http://localhost:4569"),
  }as ConfigurationOptions);
} else {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
}

const s3 = new AWS.S3();

export default s3;
