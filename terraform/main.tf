provider "aws" {
  region = "us-east-1"  # Change to your preferred region
}

resource "aws_instance" "app_server" {
  ami           = "ami-0c55b159cbfafe1f0"  # Example for Ubuntu 22.04 LTS, update as needed
  instance_type = "t2.medium"
  key_name      = "your-aws-key"  # Replace with your AWS key pair name

  security_groups = [aws_security_group.app_sg.name]

  user_data = file("user-data.sh")

  tags = {
    Name = "EasymedAppServer"
  }
}

resource "aws_security_group" "app_sg" {
  name        = "easymed-security-group"
  description = "Allow inbound traffic for app"

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]  # Restrict to your IP in production
  }

  ingress {
    from_port   = 5433
    to_port     = 5433
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "ec2_public_ip" {
  value = aws_instance.app_server.public_ip
}
