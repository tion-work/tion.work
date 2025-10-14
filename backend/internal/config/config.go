package config

import (
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	// Server configuration
	Port string
	Mode string

	// Database configuration
	DatabaseURL string

	// Redis configuration
	RedisURL string

	// API configuration
	APIKey string

	// Service configuration
	ServiceName string
	Version     string
}

var AppConfig *Config

func InitConfig() error {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		// Ignore error if .env file doesn't exist
	}

	AppConfig = &Config{
		Port:        getEnv("PORT", "8080"),
		Mode:        getEnv("GIN_MODE", "debug"),
		DatabaseURL: getEnv("DATABASE_URL", ""),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379/0"),
		APIKey:      getEnv("API_KEY", ""),
		ServiceName: getEnv("SERVICE_NAME", "Tion Backend API"),
		Version:     getEnv("VERSION", "1.0.0"),
	}

	return nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intValue, err := strconv.Atoi(value); err == nil {
			return intValue
		}
	}
	return defaultValue
}
