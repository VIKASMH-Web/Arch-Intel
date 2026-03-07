import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const region = process.env.AWS_REGION || "us-east-1";
const credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
};

// Singleton clients for AWS Integration
export const bedrockClient = new BedrockRuntimeClient({ region, credentials });
export const lambdaClient = new LambdaClient({ region, credentials });
export const s3Client = new S3Client({ region, credentials });

const ddbClient = new DynamoDBClient({ region, credentials });
export const dynamoClient = DynamoDBDocumentClient.from(ddbClient);

