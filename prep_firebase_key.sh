#!/bin/bash
# Script to format Firebase private key for Docker

# Extract the private key from .env
KEY=$(grep FIREBASE_PRIVATE_KEY .env | sed 's/^FIREBASE_PRIVATE_KEY=//;s/"//g')

# If key is not found or empty
if [ -z "$KEY" ]; then
  echo "Error: FIREBASE_PRIVATE_KEY not found in .env file."
  exit 1
fi

# Create formatted version of key for Docker
echo "FIREBASE_PRIVATE_KEY='$KEY'" > .env.docker

echo "Docker-ready environment file created in .env.docker."
echo "You can now use this file with docker-compose:"
echo "docker-compose --env-file .env.docker up"
