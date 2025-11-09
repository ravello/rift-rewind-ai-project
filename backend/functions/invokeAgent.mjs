import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

const client = new BedrockAgentRuntimeClient({
  region: "us-east-1",
});

export const handler = async (event) => {
  try {
    const agentId = process.env.AGENT_ID;
    const agentAliasId = process.env.AGENT_ALIAS;
    const sessionId = event.pathParameters.sessionId;
    const { inputText } = JSON.parse(event.body);
    const input = {
      agentId,
      agentAliasId,
      sessionId,
      inputText: inputText,
    };

    const command = new InvokeAgentCommand(input);
    let completion = "";
    const response = await client.send(command);
    if (response.completion === undefined) {
      throw new Error("Completion is undefined");
    }

    for await (const chunkEvent of response.completion) {
      const chunk = chunkEvent.chunk;
      console.log(chunk);
      const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
      completion += decodedResponse;
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: JSON.stringify({
        response: completion,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        errorMessage: error.message || "Internal Server Error",
      }),
    };
  }
};
