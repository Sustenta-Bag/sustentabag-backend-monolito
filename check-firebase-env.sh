#!/bin/sh
# Script to check Firebase environment variables in Docker container

echo "Checking Firebase environment variables in container:"
echo "FIREBASE_API_KEY: ${FIREBASE_API_KEY:0:5}... (truncated for security)"
echo "FIREBASE_AUTH_DOMAIN: $FIREBASE_AUTH_DOMAIN"
echo "FIREBASE_PROJECT_ID: $FIREBASE_PROJECT_ID"
echo "FIREBASE_STORAGE_BUCKET: $FIREBASE_STORAGE_BUCKET"
echo "FIREBASE_MESSAGING_SENDER_ID: $FIREBASE_MESSAGING_SENDER_ID"
echo "FIREBASE_APP_ID: ${FIREBASE_APP_ID:0:8}... (truncated for security)"
echo "FIREBASE_CLIENT_EMAIL: $FIREBASE_CLIENT_EMAIL"
echo "FIREBASE_PRIVATE_KEY exists: ${FIREBASE_PRIVATE_KEY:+yes}"

# Print environment variables
echo "\n--- All Environment Variables ---"
printenv | grep -v "FIREBASE_API_KEY\|FIREBASE_PRIVATE_KEY\|JWT_SECRET" # Avoid printing sensitive data
