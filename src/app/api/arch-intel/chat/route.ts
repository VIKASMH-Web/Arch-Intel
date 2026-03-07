import { NextResponse } from 'next/server';
import { bedrockClient } from '@/lib/aws-config';
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { generateChatResponse } from "@/lib/local-analysis-engine";

const BEDROCK_MODEL = "amazon.nova-lite-v1:0";

export async function POST(req: Request) {
  try {
    const { code, question, locale } = await req.json();

    console.log(`[AWS BEDROCK] Chat request: "${question.substring(0, 40)}..."`);

    // Try Amazon Bedrock (Nova Lite) first
    try {
      const prompt = `You are an expert Socratic Code Mentor. A student is asking about their code.

RULES:
1. Use a Socratic approach — guide the student with questions, don't just give answers.
2. If they ask "what does this do", explain clearly.
3. Base your answer STRICTLY on the code provided.
4. Language: ${locale}. No emojis.

CODE:
${code}

STUDENT QUESTION:
${question}

Provide a concise, helpful mentor response.`;

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
      const resultText = responseBody.output.message.content[0].text;
      console.log(`[AMAZON BEDROCK] ✅ Chat response via ${BEDROCK_MODEL}`);
      return NextResponse.json({ content: resultText });

    } catch (bedrockError: any) {
      console.warn(`[AMAZON BEDROCK] ⚠️ Chat fallback: ${bedrockError.message?.substring(0, 100)}`);
      const response = generateChatResponse(code, question);
      return NextResponse.json({ content: response });
    }

  } catch (error: any) {
    console.error("[CHAT ERROR]:", error.message);
    return NextResponse.json({ 
      content: "I couldn't process that question. Could you rephrase it?" 
    }, { status: 500 });
  }
}
