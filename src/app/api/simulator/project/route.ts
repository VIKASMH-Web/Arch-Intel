import { NextResponse } from 'next/server';
import { bedrockClient } from '@/lib/aws-config';
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { generateSimulatorResponse } from "@/lib/local-analysis-engine";

const BEDROCK_MODEL = "amazon.nova-lite-v1:0";

export async function POST(req: Request) {
  try {
    const { scenario, locale } = await req.json();

    // Try Amazon Bedrock (Nova Lite) first
    try {
      const prompt = `You are a financial analyst specializing in tech salaries. 
Analyze this scenario: "${scenario}"

Respond ONLY with a valid JSON object (no markdown, no code fences):
{
  "current": "Current Salary Estimate (e.g. ₹10 LPA)",
  "projected": "Projected Salary (e.g. ₹15 LPA)",
  "increase": "Total Increase Amount",
  "confidence": 95,
  "reasoning": ["Point 1", "Point 2", "Point 3"]
}

Output language: ${locale}. Use local currency symbols appropriate for the locale.`;

      const response = await bedrockClient.send(new InvokeModelCommand({
        modelId: BEDROCK_MODEL,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          schemaVersion: "messages-v1",
          inferenceConfig: { max_new_tokens: 1000 },
          messages: [{ role: "user", content: [{ text: prompt }] }],
        }),
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const text = responseBody.output.message.content[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

      console.log(`[AMAZON BEDROCK] ✅ Simulator projection via ${BEDROCK_MODEL}`);
      return NextResponse.json(result);

    } catch (bedrockError: any) {
      console.warn(`[AMAZON BEDROCK] ⚠️ Simulator fallback: ${bedrockError.message?.substring(0, 100)}`);
      const result = generateSimulatorResponse(scenario, locale);
      return NextResponse.json(result);
    }

  } catch (error: any) {
    console.error("[SIMULATOR ERROR]:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
