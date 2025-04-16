#!/bin/sh

# Setup steps for working with LocalStack and DynamoDB local instead of AWS.
# Assumes aws cli is installed and LocalStack and DynamoDB local are running.

# Setup AWS environment variables
echo "Setting AWS environment variables for LocalStack"

echo "AWS_ACCESS_KEY_ID=test"
export AWS_ACCESS_KEY_ID=test

echo "AWS_SECRET_ACCESS_KEY=test"
export AWS_SECRET_ACCESS_KEY=test

echo "AWS_SESSION_TOKEN=test"
export AWS_SESSION_TOKEN=test

export AWS_DEFAULT_REGION=us-east-1
echo "AWS_DEFAULT_REGION=us-east-1"

# Wait for LocalStack to be ready, by inspecting the response from healthcheck
echo 'Waiting for LocalStack S3...'
until (curl --silent http://localhost:4566/_localstack/health | grep "\"s3\": \"\(running\|available\)\"" > /dev/null); do
    sleep 5
done
echo 'LocalStack S3 Ready'
# -----------------------------------------------------------------------------
# 1) S3 Bucket: delete if exists, then create
# -----------------------------------------------------------------------------
BUCKET=fragments
echo "Checking for existing S3 bucket: $BUCKET"
if aws --endpoint-url=http://localhost:4566 s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  echo "Bucket $BUCKET exists—deleting all objects and bucket..."
  # Remove all objects (and versions) first
  aws --endpoint-url=http://localhost:4566 s3api list-object-versions \
    --bucket "$BUCKET" \
    --output=json | \
    jq -r '.Versions[],.DeleteMarkers[] | {Key:.Key,VersionId:.VersionId} | @base64' \
      | while read b64; do
          entry="$(echo "$b64" | base64 --decode)"
          key="$(echo "$entry" | jq -r .Key)"
          vid="$(echo "$entry" | jq -r .VersionId)"
          aws --endpoint-url=http://localhost:4566 s3api delete-object \
            --bucket "$BUCKET" --key "$key" --version-id "$vid"
        done

  # Now delete the bucket
  aws --endpoint-url=http://localhost:4566 s3api delete-bucket --bucket "$BUCKET"
  echo "Deleted bucket $BUCKET"
fi
# Create our S3 bucket with LocalStack
echo "Creating LocalStack S3 bucket: fragments"
aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket fragments

# Setup DynamoDB Table with dynamodb-local, see:
# https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/getting-started-step-1.html
echo "Creating DynamoDB-Local DynamoDB table: fragments"
aws --endpoint-url=http://localhost:8000 \
dynamodb create-table \
    --table-name fragments \
    --attribute-definitions \
        AttributeName=ownerId,AttributeType=S \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=ownerId,KeyType=HASH \
        AttributeName=id,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5

# Wait until the Fragments table exists in dynamodb-local, so we can use it, see:
# https://awscli.amazonaws.com/v2/documentation/api/latest/reference/dynamodb/wait/table-exists.html
aws --endpoint-url=http://localhost:8000 dynamodb wait table-exists --table-name fragments