terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region     = "us-east-1"
  access_key = "AKIAT4KRMIWGI5DTVXH3"
  secret_key = "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"
}

resource "aws_iam_policy" "lambda_bedrock_invocation_policy" {
  name        = "lambda_bedrock_invocation_policy"
  path        = "/"
  description = "Lambda Bedrock Invocation Policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "bedrock:InvokeAgent",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_role" "lambda_bedrock_invocation_role" {
  name = "lambda_bedrock_invocation_role"

  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
}

resource "aws_iam_policy_attachment" "lambda_bedrock_invocation_policy_attachment" {
  name       = "lambda_bedrock_invocation_policy_attachment"
  roles      = [aws_iam_role.lambda_bedrock_invocation_role.name]
  policy_arn = aws_iam_policy.lambda_bedrock_invocation_policy.arn
}

resource "aws_lambda_function" "invoke_agent_function" {
  filename         = data.archive_file.invoke_agent_zip.output_path
  function_name    = "invoke_agent_function"
  role             = aws_iam_role.lambda_bedrock_invocation_role.arn
  handler          = "invokeAgent.handler"
  source_code_hash = data.archive_file.invoke_agent_zip.output_base64sha256

  runtime = "nodejs22.x"
}

resource "aws_iam_policy" "lambda_bedrock_session_policy" {
  name        = "lambda_bedrock_session_policy"
  path        = "/"
  description = "Lambda Bedrock Session Policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "bedrock:CreateSession"
        ]
        Effect   = "Allow"
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_role" "lambda_bedrock_session_role" {
  name = "lambda_bedrock_session_role"

  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
}

resource "aws_iam_policy_attachment" "lambda_bedrock_session_policy_attachment" {
  name       = "lambda_bedrock_session_policy_attachment"
  roles      = [aws_iam_role.lambda_bedrock_session_role.name]
  policy_arn = aws_iam_policy.lambda_bedrock_session_policy.arn
}

resource "aws_lambda_function" "create_session_function" {
  filename         = data.archive_file.create_session_zip.output_path
  function_name    = "create_session_function"
  role             = aws_iam_role.lambda_bedrock_session_role.arn
  handler          = "createSessionId.handler"
  source_code_hash = data.archive_file.create_session_zip.output_base64sha256

  runtime = "nodejs22.x"
}

resource "aws_api_gateway_rest_api" "session_api" {
  name        = "session_api"
  description = "API Gateway REST API for Bedrock functions"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# / OPTIONS
resource "aws_api_gateway_method" "root_method" {
  rest_api_id   = aws_api_gateway_rest_api.session_api.id
  resource_id   = aws_api_gateway_rest_api.session_api.root_resource_id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "root_method_response" {
  rest_api_id = aws_api_gateway_rest_api.session_api.id
  resource_id = aws_api_gateway_rest_api.session_api.root_resource_id
  http_method = aws_api_gateway_method.root_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration" "root_integration" {
  rest_api_id = aws_api_gateway_rest_api.session_api.id
  resource_id = aws_api_gateway_rest_api.session_api.root_resource_id
  http_method = aws_api_gateway_method.root_method.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_integration_response" "root_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.session_api.id
  resource_id = aws_api_gateway_rest_api.session_api.root_resource_id
  http_method = aws_api_gateway_method.root_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_method.root_method, aws_api_gateway_integration.root_integration]
}

# /session
resource "aws_api_gateway_resource" "session_resource" {
  rest_api_id = aws_api_gateway_rest_api.session_api.id
  parent_id   = aws_api_gateway_rest_api.session_api.root_resource_id
  path_part   = "session"
}

# OPTIONS for /session
resource "aws_api_gateway_method" "session_method_options" {
  rest_api_id   = aws_api_gateway_rest_api.session_api.id
  resource_id   = aws_api_gateway_resource.session_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "session_method_response_options" {
  rest_api_id = aws_api_gateway_rest_api.session_api.id
  resource_id = aws_api_gateway_resource.session_resource.id
  http_method = aws_api_gateway_method.session_method_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration" "session_integration_options" {
  rest_api_id = aws_api_gateway_rest_api.session_api.id
  resource_id = aws_api_gateway_resource.session_resource.id
  http_method = aws_api_gateway_method.session_method_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_integration_response" "session_integration_response_options" {
  rest_api_id = aws_api_gateway_rest_api.session_api.id
  resource_id = aws_api_gateway_resource.session_resource.id
  http_method = aws_api_gateway_method.session_method_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_method.session_method_options, aws_api_gateway_integration.session_integration_options]
}

#/session/{sessionId}
resource "aws_api_gateway_resource" "session_id_resource" {
  rest_api_id = aws_api_gateway_rest_api.session_api.id
  parent_id   = aws_api_gateway_resource.session_resource.id
  path_part   = "{sessionId}"
}

# OPTIONS for /session/{sessionId}
resource "aws_api_gateway_method" "session_id_method_options" {
  rest_api_id   = aws_api_gateway_rest_api.session_api.id
  resource_id   = aws_api_gateway_resource.session_id_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method_response" "session_id_method_response_options" {
  rest_api_id = aws_api_gateway_rest_api.session_api.id
  resource_id = aws_api_gateway_resource.session_id_resource.id
  http_method = aws_api_gateway_method.session_id_method_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_integration" "session_id_integration_options" {
  rest_api_id = aws_api_gateway_rest_api.session_api.id
  resource_id = aws_api_gateway_resource.session_id_resource.id
  http_method = aws_api_gateway_method.session_id_method_options.http_method
  type        = "MOCK"

  request_templates = {
    "application/json" = "{\"statusCode\": 200}"
  }
}

resource "aws_api_gateway_integration_response" "session_id_integration_response_options" {
  rest_api_id = aws_api_gateway_rest_api.session_api.id
  resource_id = aws_api_gateway_resource.session_id_resource.id
  http_method = aws_api_gateway_method.session_id_method_options.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }

  depends_on = [aws_api_gateway_method.session_id_method_options, aws_api_gateway_integration.session_id_integration_options]
}