@echo off
echo ==== Rebuilding and Restarting Sustentabag Services ====
echo.

echo Stopping any running containers...
docker-compose down

echo.
echo Rebuilding API container with no cache...
docker-compose build --no-cache api

echo.
echo Starting all services...
docker-compose up -d

echo.
echo Checking API logs (press Ctrl+C to exit log view)...
echo.
docker-compose logs -f api

echo.
echo Done! Swagger UI should be available at: http://localhost:4041/swagger
