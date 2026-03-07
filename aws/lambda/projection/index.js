const { BedrockRuntimeClient, InvokeModelCommand } = require("@aws-sdk/client-bedrock-runtime");

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

exports.handler = async (event) => {
    console.log("Event:", JSON.stringify(event));

    const marketData = event.marketData || {};
    const userInput = event.userInput || "AWS Solutions Architect";

    // Prepare Bedrock Prompt
    const prompt = `
        Human: You are an expert financial career advisor. 
        Analyze the following market data and user career goal to project salary growth.
        Market Data: ${JSON.stringify(marketData)}
        User Goal: ${userInput}
        
        Provide a JSON response with:
        1. salary: Projected salary (e.g., "₹18.5 LPA")
        2. increase: Percentage increase (e.g., "+35%")
        3. reasoning: Array of 3 key reasons for this projection.
        
        Assistant: {
    `;

    try {
        const input = {
            modelId: "anthropic.claude-3-sonnet-20240229-v1:0", // You can change to haiku for cheaper/faster
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify({
                anthropic_version: "bedrock-2023-05-31",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            }),
        };

        const command = new InvokeModelCommand(input);
        const response = await client.send(command);
        const responseBody = JSON.parse(new TextDecoder().decode(response.body));
        
        // Extract JSON from Claude response
        const aiResponse = JSON.parse('{' + responseBody.content[0].text);

        return {
            statusCode: 200,
            salary: aiResponse.salary,
            increase: aiResponse.increase,
            reasoning: aiResponse.reasoning
        };
    } catch (error) {
        console.error("Error invoking Bedrock:", error);
        return {
            statusCode: 500,
            salary: "₹12.0 LPA (Baseline)",
            increase: "0%",
            reasoning: ["Market data sync failed", "Using fallback baseline", "Check Bedrock Model Access"]
        };
    }
};
