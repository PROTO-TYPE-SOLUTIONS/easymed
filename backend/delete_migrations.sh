#!/bin/bash

# Find and delete all folders named "migrations" and "__pycache__" recursively
find . -type d -name "migrations" -exec rm -rf {} +
find . -type d -name "__pycache__" -exec rm -rf {} +

echo "Deleted all 'migrations' and '__pycache__' directories."
