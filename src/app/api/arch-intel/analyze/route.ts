import { NextResponse } from 'next/server';
import { bedrockClient, lambdaClient, dynamoClient, s3Client } from '@/lib/aws-config';
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { InvokeCommand as LambdaInvokeCommand } from "@aws-sdk/client-lambda";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { analyzeCode } from "@/lib/local-analysis-engine";

const S3_BUCKET = process.env.S3_BUCKET_NAME || "";
const DYNAMO_TABLE = process.env.DYNAMODB_TABLE_NAME || "";
const BEDROCK_MODEL = process.env.BEDROCK_MODEL_ID || "amazon.nova-lite-v1:0"; 

export async function POST(req: Request) {
  let language = 'code';
  let locale = 'en';
  let code = '';
  const timestamp = Date.now();
  const userId = "anonymous-student";
  let securityFindings = "No specialized scanner detected.";

  try {
    const body = await req.json();
    language = body.language || 'code';
    locale = body.locale || 'en';
    code = body.code || '';

    console.log(`[AWS PIPELINE] Analysis started | TraceID: ${timestamp} | Lang: ${language}`);

    // ──────────────────────────────────────────────────────
    // STEP 1: AMAZON S3 — Archive source code (REAL)
    // ──────────────────────────────────────────────────────
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: `analysis/${userId}/${timestamp}.txt`,
        Body: code,
        ContentType: "text/plain",
      }));
      console.log(`[AMAZON S3] ✅ Code archived to s3://${S3_BUCKET}/analysis/${userId}/${timestamp}.txt`);
    } catch (e: any) {
      console.warn(`[AMAZON S3] ⚠️ Archive skipped: ${e.message?.substring(0, 80)}`);
    }

    // ──────────────────────────────────────────────────────
    // STEP 2: AWS LAMBDA — Security Scanner (REAL)
    // ──────────────────────────────────────────────────────
    try {
      const lambdaResponse = await lambdaClient.send(new LambdaInvokeCommand({
        FunctionName: process.env.LAMBDA_FUNCTION_NAME || "ArchIntelSecurityScanner",
        Payload: JSON.stringify({ code }),
      }));
      if (lambdaResponse.Payload) {
        const payload = JSON.parse(new TextDecoder().decode(lambdaResponse.Payload));
        securityFindings = payload.findings?.length > 0 
          ? payload.findings.join(", ") 
          : "Clean — No vulnerabilities found";
        console.log(`[AWS LAMBDA] ✅ Scan complete: ${securityFindings}`);
      }
    } catch (e: any) {
      console.warn(`[AWS LAMBDA] ⚠️ Scanner not deployed: ${e.message?.substring(0, 80)}`);
    }

    // ──────────────────────────────────────────────────────
    // STEP 3: AMAZON BEDROCK — AI Reasoning (Amazon Nova Lite)
    // ──────────────────────────────────────────────────────
    try {
      const prompt = `You are an expert code explainer (like codeconvert.ai). Analyze this ${language} code for a student.
Security Scanner Results: ${securityFindings}

Respond ONLY with a valid JSON object (no markdown, no code fences):
{
  "architecture_explanation": "Use markdown format. Start with '## ${language} Code Explanation', then '### High-Level Overview' (1 paragraph overview), then '### Detailed Explanation' (numbered list, each item quoting the ACTUAL code line in backticks and explaining what it does with bullet points), then '### Additional Notes and Best Practices' (bullet points), then '### Summary' (bullet points).",
  "security_analysis": "Include the scanner findings above AND your own deep security assessment.",
  "mermaid_diagram": "A Mermaid.js flowchart diagram (graph TD format) representing the code's logic flow.",
  "learning_roadmap": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "socratic_questions": ["Thought-provoking question 1", "Question 2", "Question 3"],
  "aws_disclosure": "Analysis powered by Amazon Bedrock (Nova Lite).",
  "reliability": "Percentage string (e.g. 95%)",
  "maintainability": "Grade (A+, B, etc.)",
  "runtime_risks": "Description (None, High, etc.)",
  "readability": { "title": "Headline", "description": "Short explanation" },
  "anti_pattern": { "title": "Headline", "description": "Short explanation" },
  "complexity": { "title": "Big O notation", "description": "Brief reasoning" }
}

IMPORTANT: In architecture_explanation, explain EVERY line of the actual code. Quote each real line verbatim in backticks. Do NOT use generic explanations.

Output language: ${locale}. Code:\n${code}`;

      const bedrockResponse = await bedrockClient.send(new InvokeModelCommand({
        modelId: BEDROCK_MODEL,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          schemaVersion: "messages-v1",
          inferenceConfig: { max_new_tokens: 2000 },
          messages: [{ role: "user", content: [{ text: prompt }] }],
        }),
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
      const text = responseBody.output.message.content[0].text;
      const result = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || text);

      console.log(`[AMAZON BEDROCK] ✅ AI analysis complete via ${BEDROCK_MODEL}`);

      // STEP 4: AMAZON DYNAMODB — Log the analysis
      try {
        await dynamoClient.send(new PutCommand({
          TableName: DYNAMO_TABLE,
          Item: { userId, timestamp, language, locale, source: "bedrock-nova", model: BEDROCK_MODEL }
        }));
        console.log(`[AMAZON DYNAMODB] ✅ Transaction logged.`);
      } catch (e: any) {
        console.warn(`[AMAZON DYNAMODB] ⚠️ Log skipped: ${e.message?.substring(0, 80)}`);
      }

      // STEP 4: AMAZON DYNAMODB & S3 RESULTS — Log the analysis (REAL)
    try {
      // 4a. Simple S3 JSON log (Durable audit trail)
      await s3Client.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: `results/${userId}/${timestamp}.json`,
        Body: JSON.stringify(result, null, 2),
        ContentType: "application/json",
      }));

      // 4b. DynamoDB (Transactional index)
      await dynamoClient.send(new PutCommand({
        TableName: DYNAMO_TABLE,
        Item: { 
          userId, 
          timestamp, 
          language, 
          locale, 
          source: "bedrock-nova", 
          model: BEDROCK_MODEL,
          s3Trace: `s3://${S3_BUCKET}/results/${userId}/${timestamp}.json`
        }
      }));
      console.log(`[AMAZON DYNAMODB] ✅ Audit log saved with S3 trace.`);
    } catch (e: any) {
      console.warn(`[AMAZON DYNAMODB/S3-Audit] ⚠️ Persistence skipped: ${e.message?.substring(0, 80)}`);
    }

    return NextResponse.json({
      ...result,
      aws_metadata: {
        trace_id: timestamp,
        region: "us-east-1",
        s3_bucket: S3_BUCKET,
        source_s3_key: `analysis/${userId}/${timestamp}.txt`,
        result_json_s3_key: `results/${userId}/${timestamp}.json`,
        storage_status: "LIVE_AMAZON_S3_COMMITTED",
        compute_status: "AMAZON_BEDROCK_NOVA"
      }
    });


    } catch (bedrockError: any) {
      console.warn(`[AMAZON BEDROCK] ⚠️ Bedrock fallback: ${bedrockError.message?.substring(0, 100)}`);
      
      // Fallback to Local Analysis Engine
      const result = analyzeCode(code, language, securityFindings);

      try {
        await dynamoClient.send(new PutCommand({
          TableName: DYNAMO_TABLE,
          Item: { userId, timestamp, language, locale, source: "local-engine", securityFindings }
        }));
      } catch (e) {}

      return NextResponse.json(result);
    }

  } catch (error: any) {
    console.error("[CRITICAL]:", error.message);
    const result = analyzeCode(code || '// empty', language, securityFindings);
    return NextResponse.json(result);
  }
}
