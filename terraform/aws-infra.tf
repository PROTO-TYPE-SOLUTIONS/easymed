# Copyright (C) 2018 - 2023 IT Wonder Lab (https://www.itwonderlab.com)
#
# This software may be modified and distributed under the terms
# of the MIT license.  See the LICENSE file for details.
# -------------------------------- WARNING --------------------------------
# IT Wonder Lab's best practices for infrastructure include modularizing 
# Terraform/OpenTofu configuration. 
# In this example, we define everything in a single file. 
# See other tutorials for best practices at itwonderlab.com
# -------------------------------- WARNING --------------------------------

#Define Terrraform Providers and Backend
terraform {
  required_version = "> 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

#-----------------------------------------
# Default provider: AWS
#-----------------------------------------
provider "aws" {
  shared_credentials_files = ["~/.aws/credentials"]
  profile                  = "ditwl_infradmin"
  region                   = "us-east-1"
}

# VPC
resource "aws_vpc" "ditlw-vpc" {
  cidr_block = "172.21.0.0/19" #172.21.0.0 - 172.21.31.254
  tags = {
    Name = "ditlw-vpc"
  }
}

# Subnet
resource "aws_subnet" "ditwl-sn-za-pro-pub-00" {
  vpc_id                  = aws_vpc.ditlw-vpc.id
  cidr_block              = "172.21.0.0/23" #172.21.0.0 - 172.21.1.255
  map_public_ip_on_launch = true
  tags = {
    Name = "ditwl-sn-za-pro-pub-00"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "ditwl-ig" {
  vpc_id = aws_vpc.ditlw-vpc.id
  tags = {
    Name = "ditwl-ig"
  }
}

# Routing table for public subnet (access to Internet)
resource "aws_route_table" "ditwl-rt-pub-main" {
  vpc_id = aws_vpc.ditlw-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ditwl-ig.id
  }

  tags = {
    Name = "ditwl-rt-pub-main"
  }
}

# Set new main_route_table as main
resource "aws_main_route_table_association" "ditwl-rta-default" {
  vpc_id         = aws_vpc.ditlw-vpc.id
  route_table_id = aws_route_table.ditwl-rt-pub-main.id
}

# Create a "base" Security Group to be assigned to all EC2 instances
resource "aws_security_group" "ditwl-sg-base-ec2" {
  name        = "ditwl-sg-ssh-ec2"
  vpc_id      = aws_vpc.ditlw-vpc.id
}

# DANGEROUS!!
# Allow access from the Internet to port 22 (SSH) in the EC2 instances
resource "aws_security_group_rule" "ditwl-sr-internet-to-ec2-ssh" {
  security_group_id        = aws_security_group.ditwl-sg-base-ec2.id
  type                     = "ingress"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
  cidr_blocks              = ["0.0.0.0/0"] # Internet
}

# Allow access from the Internet for ICMP protocol (e.g. ping) to the EC2 instances
resource "aws_security_group_rule" "ditwl-sr-internet-to-ec2-icmp" {
  security_group_id        = aws_security_group.ditwl-sg-base-ec2.id
  type                     = "ingress"
  from_port                = -1
  to_port                  = -1
  protocol                 = "icmp"
  cidr_blocks              = ["0.0.0.0/0"] # Internet
}

# Allow all outbound traffic to Internet
resource "aws_security_group_rule" "ditwl-sr-all-outbund" {
  security_group_id = aws_security_group.ditwl-sg-base-ec2.id
  type              = "egress"
  from_port         = "0"
  to_port           = "0"
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}

# Create a Security Group for the Front end Server
resource "aws_security_group" "ditwl-sg-front-end" {
  name        = "ditwl-sg-front-end"
  vpc_id      = aws_vpc.ditlw-vpc.id
}

# Allow access from the Internet to port 80 in the EC2 instances
resource "aws_security_group_rule" "ditwl-sr-internet-to-front-end-80" {
  security_group_id        = aws_security_group.ditwl-sg-front-end.id
  type                     = "ingress"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  cidr_blocks              = ["0.0.0.0/0"] # Internet
}

# Create a Security Group for the Back-end Server
resource "aws_security_group" "ditwl-sg-back-end" {
  name        = "ditwl-sg-back-end"
  vpc_id      = aws_vpc.ditlw-vpc.id
}

# Allow access from the front-end to port 3306 in the back-end (MariaDB)
resource "aws_security_group_rule" "ditwl-sr-front-end-to-mariadb" {
  security_group_id        = aws_security_group.ditwl-sg-back-end.id
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.ditwl-sg-front-end.id
}

# Upload a Private Key Pair for SSH Instance Authentication
resource "aws_key_pair" "ditwl-kp-config-user" {
  key_name   = "ditwl-kp-config-user"
  public_key = file("~/keys/ditwl-kp-config-user-ecdsa.pub")
}

#Find AMI Ubuntu 22.04 ARM64 Server
data "aws_ami" "ubuntu-22-04-arm64-server" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-arm64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

#Find AMI Ubuntu 23.04 ARM64 Minimal
data "aws_ami" "ubuntu-23-04-arm64-minimal" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu-minimal/images/hvm-ssd/ubuntu-lunar-23.04-arm64-minimal-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

# Front end server running Ubuntu 23.04 ARM Minimal.
resource "aws_instance" "ditwl-ec-front-end-001" {
  ami           = data.aws_ami.ubuntu-23-04-arm64-minimal.id
  instance_type = "t4g.micro"
  subnet_id     = aws_subnet.ditwl-sn-za-pro-pub-00.id
  key_name      = "ditwl-kp-config-user"
  vpc_security_group_ids = [aws_security_group.ditwl-sg-base-ec2.id,aws_security_group.ditwl-sg-front-end.id]
  tags = {
    "Name"         = "ditwl-ec-front-end-001"
    "private_name" = "ditwl-ec-front-end-001"
    "public_name"  = "www"
    "app"          = "front-end"
    "app_ver"      = "2.3"
    "os"           = "ubuntu"
    "os_ver"       = "23.04"
    "os_arch"      = "arm64"
    "environment"  = "pro"
    "cost_center"  = "green-department"
  }
}

# Back end server running Ubuntu 22.04 ARM Server.
resource "aws_instance" "ditwl-ec-back-end-123" {
  ami           = data.aws_ami.ubuntu-22-04-arm64-server.id
  instance_type = "t4g.small"
  subnet_id     = aws_subnet.ditwl-sn-za-pro-pub-00.id
  key_name      = "ditwl-kp-config-user"
  vpc_security_group_ids = [aws_security_group.ditwl-sg-base-ec2.id, aws_security_group.ditwl-sg-back-end.id]
  tags = {
    "Name"         = "ditwl-ec-back-end-123"
    "private_name" = "ditwl-ec-back-end-123"
    "public_name"  = "server"
    "app"          = "back-end"
    "app_ver"      = "1.2"
    "os"           = "ubuntu"
    "os_ver"       = "22.04"
    "os_arch"      = "arm64"
    "environment"  = "pro"
    "cost_center"  = "blue-department"
  }
}

