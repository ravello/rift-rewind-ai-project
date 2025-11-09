import {
  BedrockAgentRuntimeClient,
  CreateSessionCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

const client = new BedrockAgentRuntimeClient({
  region: "us-east-1",
});

export const handler = async (event) => {
  try {
    const command = new CreateSessionCommand();
    const response = await client.send(command);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: JSON.stringify({
        sessionId: response.sessionId,
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
