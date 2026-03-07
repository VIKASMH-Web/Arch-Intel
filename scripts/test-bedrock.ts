import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verifyBedrock() {
  const region = process.env.AWS_REGION || "us-east-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  console.log(`Checking Bedrock Connection in ${region}...`);
  
  if (!accessKeyId || !secretAccessKey) {
    console.error("Missing AWS Credentials in .env.local!");
    return;
  }

  const client = new BedrockRuntimeClient({
    region,
    credentials: { accessKeyId, secretAccessKey }
  });

  const input = {
    modelId: process.env.BEDROCK_MODEL_ID || "amazon.nova-lite-v1:0",
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      schemaVersion: "messages-v1",
      inferenceConfig: { max_new_tokens: 128 },
      messages: [{ role: "user", content: [{ text: "Hello Bedrock, verify connection via Nova Lite." }] }],
    }),
  };

  try {
    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    console.log("✅ AWS BEDROCK SUCCESS via Nova Lite!");
    console.log("Response:", result.output.message.content[0].text);
  } catch (err: any) {
    console.error("❌ AWS BEDROCK FAILED!");
    console.error("Error Name:", err.name);
    console.error("Error Message:", err.message);
    console.error("Full Error:", JSON.stringify(err, null, 2));
  }
}

verifyBedrock();
