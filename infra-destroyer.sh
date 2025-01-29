#!/bin/bash

# Set the AWS region
AWS_REGION="us-east-1"  # N. Virginia

# Export the region (important for CLI to know the region)
export AWS_DEFAULT_REGION="$AWS_REGION"

# Install AWS CLI if not already installed (you might need sudo)
if ! command -v aws &> /dev/null
then
  echo "AWS CLI not found. Installing..."
  # Example for Debian/Ubuntu:
  sudo apt-get update
  sudo apt-get install -y awscli
  # Example for macOS (using brew):
  # brew install awscli
else
  echo "AWS CLI found."
fi


# Confirm deletion (highly recommended)
read -p "Are you absolutely sure you want to delete EVERYTHING in $AWS_REGION? (yes/no): " confirmation

if [[ "$confirmation" != "yes" ]]; then
  echo "Deletion cancelled."
  exit 1
fi

echo "Proceeding with deletion..."

# List and delete S3 buckets (be VERY careful with this)
aws s3 ls | awk '{print $3}' | while read bucket; do
  echo "Deleting S3 bucket: $bucket"
  aws s3 rm "s3://$bucket" --recursive --force
  aws s3api delete-bucket --bucket "$bucket"  # Delete the bucket itself
done

# List and terminate EC2 instances
aws ec2 describe-instances --query 'Reservations[*].Instances[*].[InstanceId]' --output text | while read instance_id; do
  echo "Terminating EC2 instance: $instance_id"
  aws ec2 terminate-instances --instance-ids "$instance_id"
done

# Delete VPCs (and related resources like subnets, route tables, etc.)
aws ec2 describe-vpcs --query 'Vpcs[*].VpcId' --output text | while read vpc_id; do
  echo "Deleting VPC: $vpc_id"

  # Detach and delete Internet Gateways
  aws ec2 describe-internet-gateways --filters "Name=attachment.vpc-id,Values=$vpc_id" --query 'InternetGateways[*].InternetGatewayId' --output text | while read igw_id; do
      aws ec2 detach-internet-gateway --internet-gateway-id "$igw_id" --vpc-id "$vpc_id"
      aws ec2 delete-internet-gateway --internet-gateway-id "$igw_id"
  done

  # Delete subnets within the VPC
  aws ec2 describe-subnets --filters "Name=vpc-id,Values=$vpc_id" --query 'Subnets[*].SubnetId' --output text | while read subnet_id; do
    aws ec2 delete-subnet --subnet-id "$subnet_id"
  done

  # Delete route tables associated with the VPC (after detaching subnets)
    aws ec2 describe-route-tables --filters "Name=vpc-id,Values=$vpc_id" --query 'RouteTables[*].RouteTableId' --output text | while read rt_id; do
        aws ec2 delete-route-table --route-table-id "$rt_id"
    done

  # Delete security groups associated with the VPC
    aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$vpc_id" --query 'SecurityGroups[*].GroupId' --output text | while read sg_id; do
        aws ec2 delete-security-group --group-id "$sg_id"
    done
  aws ec2 delete-vpc --vpc-id "$vpc_id"
done

# ... (Add other resource types as needed: RDS instances, load balancers, etc.)

echo "Deletion process completed (but please double-check manually)."