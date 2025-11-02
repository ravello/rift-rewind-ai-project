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
        Resource = "arn:aws:lambda:::*"
      },
    ]
  })
}

resource "aws_iam_role" "lambda_bedrock_invoke_role" {
  name = "lambda_bedrock_invoke_role"

  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role_policy.json
}

resource "aws_iam_policy_attachment" "lambda_bedrock_invocation_policy_attachment" {
  name       = "lambda_bedrock_invocation_policy_attachment"
  roles      = [aws_iam_role.lambda_bedrock_invoke_role.name]
  policy_arn = aws_iam_policy.lambda_bedrock_invocation_policy.arn
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
        Resource = "arn:aws:lambda:::*"
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
