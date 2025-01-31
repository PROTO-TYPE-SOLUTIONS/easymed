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
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
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

  ingress {
    from_port   = 3030
    to_port     = 3030
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 9090
    to_port     = 9090
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

# Internet Gateway
resource "aws_internet_gateway" "app_igw" {
  vpc_id = aws_vpc.app_vpc.id

  tags = {
    Name = "EasymedAppIGW"
  }
}

# Create a route table with public access
resource "aws_route_table" "app_public_rt" {
  vpc_id = aws_vpc.app_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.app_igw.id
  }

  tags = {
    Name = "EasymedAppPublicRouteTable"
  }
}

# Attach the route table to the subnet
resource "aws_route_table_association" "app_subnet_assoc" {
  subnet_id      = aws_subnet.app_subnet.id
  route_table_id = aws_route_table.app_public_rt.id
}


resource "aws_key_pair" "app_server_key" {
  key_name   = "app-server-key"
  public_key = var.ssh_public_key
}

# If we go with local key
# resource "aws_key_pair" "app_server_key" {
#   key_name   = "app-server-key"
#   public_key = file("~/.ssh/id_rsa.pub")
# }


# ================== SERVER ==================
resource "aws_instance" "app_server" {
  ami           = "ami-04b4f1a9cf54c11d0"
  instance_type = "t2.medium"
  key_name      = aws_key_pair.app_server_key.key_name
  subnet_id     = aws_subnet.app_subnet.id
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  associate_public_ip_address = true

  root_block_device {
    volume_type = "gp2"
    volume_size = 50
    encrypted = true
  }

  tags = {
    Name = "EasymedAppServer"
  }
}


output "ec2_public_ip" {
  value = aws_instance.app_server.public_ip
}

# ============ GEN inventory.ini in CI for ansible ============
resource "local_file" "ansible_inventory" {
  content = <<EOT
[server]
${aws_instance.app_server.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa
EOT

  filename = "${path.module}/inventory.ini"
}

# For testing locally
# resource "local_file" "ansible_inventory" {
#   content = <<EOT
# [server]
# ${aws_instance.app_server.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa
# EOT

#   filename = "${path.module}/inventory.ini"
# }

