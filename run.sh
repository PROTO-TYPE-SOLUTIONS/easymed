#!/bin/bash

# Get the current directory
current_dir=$(pwd)

# Open a new terminal in the current directory
gnome-terminal --working-directory="$current_dir" -- bash -c "
cd backend

# Check if directory exists and remove virtualenv
if [[ -d 'venv' ]]; then
   echo 'Removing existing virtual environment...'
   rm -rf venv
fi

# Create a new virtual environment
virtualenv venv
source venv/bin/activate

# Run the Django makemigrations command
python manage.py makemigrations

# Run createsuperuser and automate the email and password prompts
expect -c '
spawn python manage.py createsuperuser
expect "Email:*"
send "admin@mail.com\r"
expect "Password:*"
send "yourpassword123\r"
expect "Password (again):*"
send "yourpassword123\r"
interact
'

# Start a new bash session with the virtual environment activated
exec bash --init-file <(echo 'source venv/bin/activate')"
