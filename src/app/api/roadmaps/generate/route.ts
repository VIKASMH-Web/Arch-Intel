import { NextResponse } from 'next/server';
import { bedrockClient } from '@/lib/aws-config';
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { fullSearch } from "@/lib/roadmap-engine";

const BEDROCK_MODEL = "amazon.nova-lite-v1:0";

export async function POST(req: Request) {
  try {
    const { skills, locale } = await req.json();
    const query = Array.isArray(skills) ? skills[0] : skills;

    // Use Rule-based Logic first (Instant, No Paid API)
    const engineResult = fullSearch(query || 'Cloud Architect');
    const { roadmap, resources, tools } = engineResult;
    
    const formattedLocalSteps = roadmap.stages.map((stage: any) => ({
      ...stage,
      description: stage.topics ? stage.topics.join(', ') : '',
      certs: roadmap.label,
      importance: 'core',
      estimated_weeks: parseInt(stage.duration) || 2,
      status: 'todo'
    }));

    // Optionally try Amazon Bedrock (Nova Lite) to enrich if allowed/requested
    try {
      const prompt = `Create a learning roadmap for: ${query}. 
      Respond ONLY with a JSON array of 6 steps like: {"title": "...", "description": "...", "modules": [...], "certs": "...", "importance": "core", "estimated_weeks": 2, "status": "todo"}.
      Language: ${locale}.`;

      const response = await bedrockClient.send(new InvokeModelCommand({
        modelId: BEDROCK_MODEL,
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          schemaVersion: "messages-v1",
          inferenceConfig: { max_new_tokens: 2000 },
          messages: [{ role: "user", content: [{ text: prompt }] }],
        }),
      }));

      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      const text = responseBody.output.message.content[0].text;
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);

      console.log(`[AMAZON BEDROCK] ✅ Enhanced Roadmap generated`);
      return NextResponse.json({
        steps: result,
        resources,
        tools,
        label: roadmap.label
      });
    } catch (bedrockError: any) {
      console.warn(`[ENGINE FALLBACK] Using local roadmap engine: ${bedrockError.message?.substring(0, 50)}`);
      return NextResponse.json({
        steps: formattedLocalSteps,
        resources,
        tools,
        label: roadmap.label
      });
    }

  } catch (error: any) {
    console.error("[ROADMAP ERROR]:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
