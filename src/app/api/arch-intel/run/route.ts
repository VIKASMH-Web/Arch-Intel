import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { language, code, input = "" } = await req.json();

    // Mapping languages to Judge0 IDs
    const langMap: Record<string, number> = {
      'python': 71,
      'python3': 71,
      'javascript': 63,
      'js': 63,
      'cpp': 54,
      'c++': 54,
      'c': 50,
      'java': 62,
      'typescript': 74,
      'ts': 74
    };

    const judgeLangId = langMap[language.toLowerCase()] || 71;

    // Using Judge0 Community Edition (free public instance)
    const response = await fetch('https://ce.judge0.com/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code,
        language_id: judgeLangId,
        stdin: input
      })
    });

    const data = await response.json();
    
    // Normalize response for our UI
    return NextResponse.json({
      output: data.stdout || data.compile_output || data.stderr || "(No Output)",
      error: data.stderr || data.compile_output || "",
      status: data.status?.description,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("[JUDGE0 ERROR]:", error.message);
    return NextResponse.json({ error: "Code Execution Engine Offline. Try again in 1 minute." }, { status: 500 });
  }
}
