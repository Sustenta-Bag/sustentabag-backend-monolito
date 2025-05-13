# Solving Docker Container Startup Issues

This guide outlines steps to fix Docker container startup issues and Firebase API key problems.

## Problem 1: `/start.sh: not found` error

This error occurs because the Docker container can't find the startup script. We've fixed this by:
1. Updating the Dockerfile to use the correct path for the start script
2. Using `sh` instead of `/bin/sh` to improve compatibility
3. Fixing script creation to ensure it's properly executable

## Problem 2: Firebase API Key error and connection issues

These errors occur when the environment variables aren't properly passed to the container. We've fixed this by:
1. Making the `.env` file available to Docker Compose
2. Explicitly specifying environment variables in docker-compose.yml
3. Adding special handling for the Firebase private key

## Steps to Apply the Fix

1. **Stop any running containers:**
   ```powershell
   docker-compose down
   ```

2. **Clean up Docker resources (optional):**
   ```powershell
   docker system prune -a --volumes
   ```

3. **Build new containers with the fixed Dockerfile:**
   ```powershell
   docker-compose build --no-cache
   ```

4. **Start the containers:**
   ```powershell
   docker-compose up -d
   ```

5. **Check the logs:**
   ```powershell
   docker-compose logs -f api
   ```

## If Issues Persist

1. **Check if the API key is valid:**
   - Verify your Firebase configuration in the Firebase Console
   - Make sure the API key is not restricted by IP address

2. **Verify environment variables in the running container:**
   ```powershell
   docker-compose exec api sh -c 'env | grep FIREBASE'
   ```

3. **Test the API directly inside the container:**
   ```powershell
   docker-compose exec api sh -c 'node src/scripts/test-firebase-config.js'
   ```

## Swagger UI Access

After successfully starting the container, access the Swagger UI at:
```
http://localhost:4041/swagger
```
