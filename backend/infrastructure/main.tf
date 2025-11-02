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
