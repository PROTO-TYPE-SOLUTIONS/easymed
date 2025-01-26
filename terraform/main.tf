provider "aws" {
  region = "us-east-1"
}


# ================== NETWORK ==================
resource "aws_vpc" "app_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "EasymedAppVPC"
  }
}

resource "aws_subnet" "app_subnet" {
  vpc_id            = aws_vpc.app_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "EasymedAppSubnet"
  }
}

resource "aws_security_group" "app_sg" {
  name        = "easymed-security-group"
  description = "Allow inbound traffic for app"
  vpc_id      = aws_vpc.app_vpc.id


  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
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

resource "aws_key_pair" "app_server_key" {
  key_name   = "app-server-key"
  public_key = file("~/.ssh/id_rsa.pub")
}


# ================== SERVER ==================
resource "aws_instance" "app_server" {
  ami           = "ami-006a0fdfea2775802"
  instance_type = "t2.micro"
  key_name      = aws_key_pair.app_server_key.key_name
  subnet_id     = aws_subnet.app_subnet.id
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = file("user-data.sh")

  tags = {
    Name = "EasymedAppServer"
  }
}


output "ec2_public_ip" {
  value = aws_instance.app_server.public_ip
}
