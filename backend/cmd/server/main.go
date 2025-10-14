package main

import (
	"log"
	"tion-backend/internal/api"
	"tion-backend/internal/config"
	"tion-backend/internal/database"
	"tion-backend/pkg/logging"

	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize configuration
	if err := config.InitConfig(); err != nil {
		log.Fatal("Failed to initialize config:", err)
	}

	// Initialize logging
	logging.InitLogging()

	// Initialize database
	if err := database.InitDatabase(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	// Set Gin mode
	gin.SetMode(config.AppConfig.Mode)

	// Create Gin engine
	r := gin.Default()

	// Setup CORS
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Setup routes
	api.SetupRoutes(r)

	// Start server
	port := config.AppConfig.Port
	logging.Infof("Starting tion-backend server on port %s", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
