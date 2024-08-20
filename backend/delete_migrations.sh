#!/bin/bash

# Get the current directory of the script

DIR="$( cd "$( app "${BASH_SOURCE[0]}" )" && pwd )"

# Specify the path to your Django project
PROJECT_PATH="$DIR"

# Loop through all apps in the project and delete migration folders
for app in $PROJECT_PATH/*/; do
    migration_folder="$app/migrations"
    if [ -d "$migration_folder" ]; then
        echo "Deleting migrations in $app"
        rm -rf "$migration_folder"
    fi
done

echo "Migrations deleted successfully."
# run migrations
source env/bin/activate

python manage.py makemigrations authperms customuser inventory laboratory patient pharmacy receptions
python manage.py migrate

echo "Migrations made successfully"

