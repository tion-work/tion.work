# tion-backend Makefile

.PHONY: help build run test clean deps dev docker-build docker-run seed

# Default target
help:
	@echo "tion-backend - Go Gin API Server"
	@echo ""
	@echo "🚀 Development commands:"
	@echo "  deps        - Install dependencies"
	@echo "  build       - Build the application"
	@echo "  run         - Run the application"
	@echo "  dev         - Run in development mode with hot reload"
	@echo "  test        - Run tests"
	@echo "  clean       - Clean build artifacts"
	@echo "  seed        - Seed database with initial data"
	@echo ""
	@echo "🐳 Docker commands:"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-run   - Run Docker container"
	@echo ""

# Install dependencies
deps:
	@echo "📦 Installing dependencies..."
	go mod tidy
	go mod download

# Build the application
build:
	@echo "🔨 Building application..."
	go build -o bin/tion-backend cmd/server/main.go

# Run the application
run: build
	@echo "🚀 Starting tion-backend server..."
	./bin/tion-backend

# Run in development mode
dev:
	@echo "🚀 Starting development server..."
	go run cmd/server/main.go

# Run tests
test:
	@echo "🧪 Running tests..."
	go test ./...

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf bin/
	go clean

# Build Docker image
docker-build:
	@echo "🐳 Building Docker image..."
	docker build -t tion-backend .

# Run Docker container
docker-run:
	@echo "🐳 Running Docker container..."
	docker run -p 8080:8080 --env-file .env tion-backend

# Install air for hot reload (if not installed)
install-air:
	@echo "📦 Installing air for hot reload..."
	go install github.com/cosmtrek/air@latest

# Run with hot reload (requires air)
dev-air: install-air
	@echo "🚀 Starting development server with hot reload..."
	air

# Seed database with initial data
seed:
	@echo "🌱 Seeding database with initial data..."
	go run scripts/seed.go
