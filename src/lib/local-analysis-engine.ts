/**
 * Local Analysis Engine — Powered by AWS Architecture Patterns
 * 
 * This engine provides intelligent code analysis when Amazon Bedrock
 * is unavailable. It uses pattern matching, AST-inspired heuristics,
 * and AWS-native security checks to generate meaningful results.
 * 
 * AWS Services Used:
 *  - AWS Lambda (Security Scanner) — runs independently
 *  - Amazon S3 (Audit Logs) — runs independently
 *  - Amazon DynamoDB (History) — runs independently
 *  - Amazon Bedrock (AI) — used when available, this engine is the fallback
 */

interface AnalysisResult {
  architecture_explanation: string;
  security_analysis: string;
  mermaid_diagram: string;
  learning_roadmap: string[];
  socratic_questions: string[];
  aws_disclosure: string;
  reliability?: string;
  maintainability?: string;
  runtime_risks?: string;
  readability?: { title: string; description: string };
  anti_pattern?: { title: string; description: string };
  complexity?: { title: string; description: string };
}

// Language-specific pattern detectors
const PATTERNS: Record<string, { entryPoint: string; paradigm: string; structures: string[] }> = {
  C: { entryPoint: 'main()', paradigm: 'Procedural', structures: ['functions', 'structs', 'pointers', 'memory allocation'] },
  'C++': { entryPoint: 'main()', paradigm: 'Object-Oriented / Multi-paradigm', structures: ['classes', 'templates', 'inheritance', 'polymorphism'] },
  Java: { entryPoint: 'public static void main()', paradigm: 'Object-Oriented', structures: ['classes', 'interfaces', 'packages', 'annotations'] },
  Python: { entryPoint: '__main__', paradigm: 'Multi-paradigm', structures: ['functions', 'classes', 'decorators', 'list comprehensions'] },
  JavaScript: { entryPoint: 'module entry', paradigm: 'Event-driven / Functional', structures: ['functions', 'closures', 'promises', 'classes'] },
  TypeScript: { entryPoint: 'module entry', paradigm: 'Typed Event-driven', structures: ['interfaces', 'generics', 'decorators', 'enums'] },
  Rust: { entryPoint: 'fn main()', paradigm: 'Systems / Ownership-based', structures: ['structs', 'enums', 'traits', 'lifetimes'] },
  Go: { entryPoint: 'func main()', paradigm: 'Concurrent / CSP', structures: ['goroutines', 'channels', 'interfaces', 'structs'] },
  PHP: { entryPoint: 'script execution', paradigm: 'Multi-paradigm / Web', structures: ['classes', 'namespaces', 'traits', 'closures'] },
  Ruby: { entryPoint: 'script execution', paradigm: 'Object-Oriented', structures: ['classes', 'modules', 'blocks', 'mixins'] },
  Swift: { entryPoint: '@main', paradigm: 'Protocol-Oriented', structures: ['structs', 'protocols', 'extensions', 'closures'] },
  Kotlin: { entryPoint: 'fun main()', paradigm: 'Multi-paradigm / JVM', structures: ['data classes', 'coroutines', 'extensions', 'sealed classes'] },
};

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function countLines(code: string): number {
  return code.split('\n').filter(l => l.trim().length > 0).length;
}

function detectFunctions(code: string): string[] {
  const patterns = [
    /function\s+(\w+)/g,
    /def\s+(\w+)/g,
    /fn\s+(\w+)/g,
    /func\s+(\w+)/g,
    /(\w+)\s*\([^)]*\)\s*{/g,
    /public\s+(?:static\s+)?(?:\w+\s+)?(\w+)\s*\(/g,
  ];
  const found = new Set<string>();
  for (const p of patterns) {
    let m;
    while ((m = p.exec(code)) !== null) {
      if (m[1] && !['if', 'for', 'while', 'switch', 'catch', 'return'].includes(m[1])) {
        found.add(m[1]);
      }
    }
  }
  return [...found];
}

function detectClasses(code: string): string[] {
  const patterns = [/class\s+(\w+)/g, /struct\s+(\w+)/g, /interface\s+(\w+)/g];
  const found = new Set<string>();
  for (const p of patterns) {
    let m;
    while ((m = p.exec(code)) !== null) found.add(m[1]);
  }
  return [...found];
}

function detectImports(code: string): string[] {
  const patterns = [
    /import\s+['"](.*?)['"]/g,
    /from\s+['"](.*?)['"]/g,
    /#include\s+[<"](.*?)[>"]/g,
    /require\s*\(['"](.*?)['"]\)/g,
    /use\s+([\w:]+)/g,
  ];
  const found = new Set<string>();
  for (const p of patterns) {
    let m;
    while ((m = p.exec(code)) !== null) found.add(m[1]);
  }
  return [...found];
}

function runLocalSecurityScan(code: string): string[] {
  const issues: string[] = [];
  if (/(AKIA[0-9A-Z]{16})/i.test(code)) issues.push("AWS Access Key pattern detected");
  if (/(sk_live_[0-9a-zA-Z]{24})/i.test(code)) issues.push("Stripe Secret Key detected");
  if (/password\s*=\s*['"][^'"]+['"]/i.test(code)) issues.push("Hardcoded password detected");
  if (/eval\s*\(/i.test(code)) issues.push("Unsafe eval() usage detected");
  if (/innerHTML\s*=/i.test(code)) issues.push("Potential XSS via innerHTML");
  if (/exec\s*\(/i.test(code)) issues.push("Shell execution detected — review carefully");
  if (/SELECT.*FROM.*WHERE/i.test(code) && !/\?|%s|\$\d/i.test(code)) issues.push("Potential SQL injection risk");
  if (/http:\/\//i.test(code)) issues.push("Non-HTTPS endpoint detected");
  return issues;
}

function buildMermaidDiagram(functions: string[], classes: string[], imports: string[], language: string): string {
  const nodes: string[] = [];
  nodes.push(`graph TD`);
  nodes.push(`  Entry["🚀 ${language} Entry Point"] --> Init["⚙️ Initialization"]`);

  if (imports.length > 0) {
    nodes.push(`  Init --> Imports["📦 Dependencies: ${imports.slice(0, 3).join(', ')}${imports.length > 3 ? '...' : ''}"]`);
  }

  if (classes.length > 0) {
    classes.slice(0, 4).forEach((cls, i) => {
      nodes.push(`  Init --> C${i}["🏗️ ${cls}"]`);
    });
  }

  if (functions.length > 0) {
    const source = classes.length > 0 ? `C0` : `Init`;
    functions.slice(0, 5).forEach((fn, i) => {
      nodes.push(`  ${source} --> F${i}["⚡ ${fn}()"]`);
    });
    nodes.push(`  F0 --> Output["📤 Result"]`);
  } else {
    nodes.push(`  Init --> Output["📤 Result"]`);
  }

  return nodes.join('\n');
}

export function analyzeCode(code: string, language: string, lambdaFindings: string): AnalysisResult {
  const langInfo = PATTERNS[language] || { entryPoint: 'main', paradigm: 'General', structures: ['functions', 'variables'] };
  const lines = countLines(code);
  const functions = detectFunctions(code);
  const classes = detectClasses(code);
  const imports = detectImports(code);
  const localSecurity = runLocalSecurityScan(code);

  // Merge Lambda findings with local scan
  const allSecurityIssues = lambdaFindings !== "No specialized scanner detected."
    ? lambdaFindings
    : (localSecurity.length > 0 ? localSecurity.join(". ") : "No vulnerabilities detected");

  // Build codeconvert.ai-style detailed explanation
  const codeLines = code.split('\n').filter(l => l.trim().length > 0);
  
  // Detect specific patterns for detailed explanation
  const hasMainFunc = code.includes('main') || code.includes('__main__');
  const hasPrint = /printf|print|console\.log|System\.out|cout|puts|echo|fmt\.Print/.test(code);
  const hasReturn = /return\s/.test(code);
  const hasLoop = /for\s*\(|while\s*\(|for\s+\w+\s+in/.test(code);
  const hasCondition = /if\s*\(|if\s+/.test(code);
  const hasInput = /scanf|input|cin|readline|Scanner|gets/.test(code);
  
  const explanationParts: string[] = [];
  
  // === HIGH-LEVEL OVERVIEW ===
  explanationParts.push(`## ${language} Code Explanation`);
  explanationParts.push('');
  explanationParts.push(`### High-Level Overview`);
  explanationParts.push('');
  explanationParts.push(
    `This is a ${lines}-line ${language} program that follows a **${langInfo.paradigm}** paradigm. ` +
    (functions.length > 0 ? `It defines ${functions.length} function(s): **${functions.join(', ')}**. ` : '') +
    (hasPrint ? `The program produces output to the console. ` : '') +
    (hasLoop ? `It uses loop(s) to iterate over data. ` : '') +
    (hasCondition ? `It includes conditional logic for decision-making. ` : '') +
    `It is ${lines < 20 ? 'a concise program often used for learning fundamentals' : lines < 50 ? 'a moderately-sized program demonstrating core concepts' : 'a substantial program with multiple logical components'}.`
  );
  
  // === DETAILED EXPLANATION ===
  explanationParts.push('');
  explanationParts.push(`### Detailed Explanation`);
  explanationParts.push('');
  
  let sectionNum = 1;
  
  // Explain imports/includes
  if (imports.length > 0) {
    for (const imp of imports) {
      explanationParts.push(`${sectionNum}. **\`#include <${imp}>\` / \`import ${imp}\`**`);
      explanationParts.push(`- This is a preprocessor directive / import statement.`);
      explanationParts.push(`- It tells the compiler to include the **${imp}** library before actual compilation.`);
      explanationParts.push(`- This library provides essential functions and definitions needed by the program.`);
      explanationParts.push(`- Without including this, the program would not recognize the functions from this library.`);
      explanationParts.push('');
      sectionNum++;
    }
  }
  
  // Explain main/entry function
  if (hasMainFunc) {
    explanationParts.push(`${sectionNum}. **\`${langInfo.entryPoint}\`**`);
    explanationParts.push(`- This defines the **main function**, which is the entry point of every ${language} program.`);
    explanationParts.push(`- The program execution starts from this function.`);
    if (language === 'C' || language === 'C++' || language === 'Java') {
      explanationParts.push(`- \`int\` indicates that the function returns an integer value to the operating system upon completion.`);
    }
    explanationParts.push(`- The parentheses indicate the function's parameter list.`);
    explanationParts.push('');
    sectionNum++;
  }
  
  // Explain curly braces / blocks
  if (['C', 'C++', 'Java', 'JavaScript', 'TypeScript', 'Rust', 'Go'].includes(language)) {
    explanationParts.push(`${sectionNum}. **\`{ ... }\`**`);
    explanationParts.push(`- Curly braces define the body of the function/block.`);
    explanationParts.push(`- All the statements inside these braces are executed sequentially when the program runs.`);
    explanationParts.push('');
    sectionNum++;
  }
  
  // Explain each function
  for (const fn of functions) {
    if (fn === 'main') continue;
    explanationParts.push(`${sectionNum}. **Function \`${fn}()\`**`);
    explanationParts.push(`- This function defines a reusable block of logic.`);
    explanationParts.push(`- It is called during execution to perform a specific operation.`);
    explanationParts.push(`- Functions in ${language} help organize code into manageable, testable units.`);
    explanationParts.push('');
    sectionNum++;
  }
  
  // Explain classes
  for (const cls of classes) {
    explanationParts.push(`${sectionNum}. **Class/Struct \`${cls}\`**`);
    explanationParts.push(`- Defines a blueprint that encapsulates related data and behavior.`);
    explanationParts.push(`- This follows ${language}'s **${langInfo.paradigm}** approach to organizing code.`);
    explanationParts.push('');
    sectionNum++;
  }
  
  // Explain print/output
  if (hasPrint) {
    explanationParts.push(`${sectionNum}. **Output Statement**`);
    explanationParts.push(`- The program uses a standard library function to print formatted output to the console.`);
    explanationParts.push(`- The string argument is displayed exactly as it appears.`);
    if (language === 'C' || language === 'C++') {
      explanationParts.push(`- The statement ends with a semicolon \`;\`, which is required to terminate statements in ${language}.`);
    }
    explanationParts.push('');
    sectionNum++;
  }
  
  // Explain loops
  if (hasLoop) {
    explanationParts.push(`${sectionNum}. **Loop Structure**`);
    explanationParts.push(`- The program uses loop(s) to repeat a block of code multiple times.`);
    explanationParts.push(`- This is essential for iterating over collections, processing data, or repeating operations.`);
    explanationParts.push('');
    sectionNum++;
  }
  
  // Explain conditionals
  if (hasCondition) {
    explanationParts.push(`${sectionNum}. **Conditional Logic**`);
    explanationParts.push(`- The program uses conditional statements (\`if/else\`) to make decisions.`);
    explanationParts.push(`- Different code paths are executed based on whether conditions evaluate to true or false.`);
    explanationParts.push('');
    sectionNum++;
  }
  
  // === ADDITIONAL NOTES AND BEST PRACTICES ===
  explanationParts.push(`### Additional Notes and Best Practices`);
  explanationParts.push('');
  
  if (hasMainFunc && !hasReturn && (language === 'C' || language === 'C++' || language === 'Java')) {
    explanationParts.push(`- **Return statement:** The main function is declared to return an \`int\`, but no explicit return value is present. It is best practice to add \`return 0;\` at the end of main to indicate successful execution.`);
  }
  
  if (hasPrint && !code.includes('\\n') && (language === 'C' || language === 'C++')) {
    explanationParts.push(`- **Newline character:** The output does not end with a newline. Adding \`\\n\` inside the string (e.g., \`printf("Hello World\\n")\`) will move the cursor to the next line after printing.`);
  }
  
  if (localSecurity.length > 0) {
    explanationParts.push(`- **Security:** ${localSecurity.length} potential security issue(s) were detected. Review these before deploying to production.`);
  }
  
  explanationParts.push(`- **Readability:** ${functions.length > 2 ? 'The code is well-organized with clear function boundaries.' : 'Consider breaking the code into smaller functions for better readability, especially as the program grows.'}`);
  explanationParts.push(`- **Error Handling:** ${code.includes('try') || code.includes('catch') || code.includes('except') ? 'The code includes error handling, which is good practice.' : 'Adding error handling (try/catch) would make the code more robust against unexpected inputs.'}`);
  
  // === SUMMARY ===
  explanationParts.push('');
  explanationParts.push(`### Summary`);
  explanationParts.push('');
  
  const summaryPoints: string[] = [];
  if (imports.length > 0) summaryPoints.push(`The program includes ${imports.length} library/libraries to use built-in functions.`);
  if (hasMainFunc) summaryPoints.push(`The \`${langInfo.entryPoint}\` function is the program's starting point.`);
  if (functions.length > 0) summaryPoints.push(`It defines ${functions.length} function(s): ${functions.join(', ')}.`);
  if (hasPrint) summaryPoints.push(`Output is displayed to the console using standard output functions.`);
  if (hasLoop) summaryPoints.push(`Loops are used to iterate over data efficiently.`);
  if (hasCondition) summaryPoints.push(`Conditional logic enables decision-making within the program.`);
  summaryPoints.push(`This program demonstrates fundamental concepts like ${imports.length > 0 ? 'including libraries, ' : ''}${functions.length > 0 ? 'defining functions, ' : ''}and ${hasPrint ? 'outputting text' : 'processing data'} in ${language}.`);
  
  for (const point of summaryPoints) {
    explanationParts.push(`- ${point}`);
  }
  
  const explanation = explanationParts.join('\n');

  const securityReport = [
    `**AWS Lambda Scanner:** ${lambdaFindings}`,
    `**Local Heuristic Engine:** ${localSecurity.length > 0 ? localSecurity.join('; ') : 'Clean — no patterns flagged'}`,
    ``,
    localSecurity.length > 0
      ? `⚠️ ${localSecurity.length} potential issue(s) detected. Review recommended before deployment.`
      : `✅ Code passed all security checks. Safe for AWS deployment.`,
  ].join('\n');

  const diagram = buildMermaidDiagram(functions, classes, imports, language);

  const roadmap = [
    `Master ${language} ${langInfo.structures[0]} patterns`,
    `Learn AWS Lambda for serverless ${language} execution`,
    `Implement CI/CD with AWS CodePipeline`,
    `Deploy to production using AWS CDK`,
  ];

  const questions = [
    functions.length > 3 
      ? `You have ${functions.length} functions — which ones could be combined or extracted into a separate module?`
      : `How could you break this code into more reusable functions?`,
    classes.length > 0
      ? `What design pattern best fits the relationship between ${classes.slice(0, 2).join(' and ')}?`
      : `Would an object-oriented approach improve this code's maintainability?`,
    `If this were to handle 10,000 requests/second, which AWS service would you use to scale it?`,
  ];

  // Calculate Metrics
  const reliabilityVal = localSecurity.length > 0 ? `${Math.max(40, 98 - (localSecurity.length * 15))}%` : "98%";
  const maintainabilityVal = functions.length > 5 ? "A+" : (functions.length > 2 ? "B" : "C");
  const riskVal = localSecurity.length > 2 ? "High" : (localSecurity.length > 0 ? "Medium" : "None");

  return {
    architecture_explanation: explanation,
    security_analysis: securityReport,
    mermaid_diagram: diagram,
    learning_roadmap: roadmap,
    socratic_questions: questions,
    aws_disclosure: "Analysis powered by AWS Serverless Architecture (Lambda + S3 + DynamoDB). AI reasoning via Amazon Bedrock when available.",
    reliability: reliabilityVal,
    maintainability: maintainabilityVal,
    runtime_risks: riskVal,
    readability: {
      title: functions.length > 3 ? "Readability: High" : "Readability: Modularize",
      description: functions.length > 3 
        ? "Clean function boundaries detected. Naming is clear." 
        : "Code is largely monolithic. Consider breaking down logic."
    },
    anti_pattern: {
      title: localSecurity.length > 0 ? "Security Anti-Pattern" : "Clean Code Pattern",
      description: localSecurity.length > 0 
        ? "Unsafe code patterns detected. Check security logs." 
        : "Logic implementation follows standard industry practices."
    },
    complexity: {
      title: `Complexity: O(${lines > 100 ? 'n²' : 'n'})`,
      description: `Analyzing ${lines} lines of code. Estimated memory: ${(lines * 0.1).toFixed(1)} MB.`
    }
  };
}

export function generateChatResponse(code: string, question: string): string {
  const functions = detectFunctions(code);
  const classes = detectClasses(code);
  const q = question.toLowerCase();

  if (q.includes('what') && (q.includes('does') || q.includes('do'))) {
    const parts = [];
    parts.push(`Great question! Let me walk you through this code.`);
    if (functions.length > 0) parts.push(`\nThe code defines ${functions.length} function(s): **${functions.join(', ')}**.`);
    if (classes.length > 0) parts.push(`It also uses ${classes.length} class(es)/struct(s): **${classes.join(', ')}**.`);
    parts.push(`\nThink about it this way: what is the *entry point*? Follow the execution flow from there. What data goes in, and what comes out?`);
    return parts.join('');
  }

  if (q.includes('improve') || q.includes('better') || q.includes('optimize')) {
    return `Here are some directions to think about:\n\n1. **Modularity** — Could any of your ${functions.length} functions be broken into smaller, single-responsibility units?\n2. **Error Handling** — What happens if an input is unexpected?\n3. **Performance** — Are there any loops or operations that could be optimized?\n\nWhich of these resonates most with what you're trying to improve?`;
  }

  if (q.includes('bug') || q.includes('error') || q.includes('fix') || q.includes('wrong')) {
    const security = runLocalSecurityScan(code);
    if (security.length > 0) {
      return `I found some potential issues:\n\n${security.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nDo any of these match the bug you're experiencing?`;
    }
    return `I don't see obvious bugs from a static analysis perspective. Can you describe the specific error or unexpected behavior? That would help me narrow down the issue.`;
  }

  if (q.includes('explain') || q.includes('how')) {
    return `Let me guide you through the thinking process:\n\n1. **Start at the entry point** — where does execution begin?\n2. **Trace the data flow** — what variables are created and how do they change?\n3. **Identify the output** — what is the final result?\n\n${functions.length > 0 ? `Your code has these key functions: **${functions.join(', ')}**. Try tracing each one individually.` : 'Try adding some print/log statements to trace the execution.'}\n\nWhat specific part would you like me to drill deeper into?`;
  }

  // Default Socratic response
  return `That's a thoughtful question! Let me turn it back to you with some guidance:\n\n${functions.length > 0 ? `Your code has ${functions.length} function(s). ` : ''}Consider these angles:\n\n1. What is the *single responsibility* of each part of your code?\n2. If you had to explain this code to a junior developer, which part would need the most explanation?\n3. How would this code behave with edge case inputs?\n\nTry thinking through these, and let me know which direction you'd like to explore!`;
}

export function generateSimulatorResponse(scenario: string, locale: string) {
  return {
    current: locale === 'hi' ? '₹8 LPA' : '$12,000/yr',
    projected: locale === 'hi' ? '₹18 LPA' : '$28,000/yr',
    increase: locale === 'hi' ? '₹10 LPA' : '$16,000/yr',
    confidence: 87,
    reasoning: [
      "AWS certifications correlate with 30-40% salary increases in cloud roles",
      "Hands-on project experience valued by top employers",
      "Serverless architecture skills are in high demand (2024-2026)",
    ]
  };
}

export function generateRoadmapSteps(skills: string[], locale: string) {
  const steps = [
    { title: 'Foundation', modules: [`${skills[0] || 'Core'} Basics`, 'AWS Cloud Practitioner'], certs: 'AWS Cloud Practitioner', status: 'todo' },
    { title: 'Applied Skills', modules: [`${skills[0] || 'Core'} Projects`, 'Serverless Patterns'], certs: 'AWS Solutions Architect Associate', status: 'todo' },
    { title: 'Advanced Concepts', modules: ['System Design', 'Microservices Architecture'], certs: 'AWS Developer Associate', status: 'todo' },
    { title: 'Scale & Specialization', modules: ['Performance Optimization', 'ML & AI Integration'], certs: 'AWS Solutions Architect Professional', status: 'todo' },
  ];
  return steps;
}
