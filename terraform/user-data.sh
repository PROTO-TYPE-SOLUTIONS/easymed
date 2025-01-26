
#!/bin/bash
apt update -y
apt install -y docker.io docker-compose
usermod -aG docker ubuntu
systemctl enable docker
