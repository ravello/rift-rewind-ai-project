data "aws_iam_policy_document" "lambda_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "archive_file" "invoke_agent_zip" {
  type        = "zip"
  source_file = "${path.root}/../functions/invokeAgent.mjs"
  output_path = "${path.root}/../functions/invokeAgent.zip"
}

data "archive_file" "create_session_zip" {
  type        = "zip"
  source_file = "${path.root}/../functions/createSessionId.mjs"
  output_path = "${path.root}/../functions/createSessionId.zip"
}
