package api

import (
	"tion-backend/internal/middleware"
	"tion-backend/internal/response"

	"github.com/gin-gonic/gin"
)

// SetupRoutes sets up all routes
func SetupRoutes(r *gin.Engine) {
	// Initialize middleware
	middleware.InitMiddleware()

	// API route group
	api := r.Group("/api")
	{
		// Health check
		api.GET("/health", HealthCheck)

		// Tools routes
		tools := api.Group("/tools")
		{
			tools.GET("/", GetTools)
			tools.GET("/:id", GetTool)
			tools.POST("/", CreateTool)
			tools.PUT("/:id", UpdateTool)
			tools.DELETE("/:id", DeleteTool)
			tools.POST("/:id/use", RecordToolUsage)
		}

		// Statistics routes
		stats := api.Group("/stats")
		{
			stats.GET("/tools", GetToolStats)
			stats.GET("/usage", GetUsageStats)
			stats.GET("/overview", GetOverviewStats)
		}

		// Admin routes (require API key)
		admin := api.Group("/admin")
		admin.Use(middleware.APIKeyMiddleware())
		{
			admin.GET("/tools", GetTools)
			admin.POST("/tools", CreateTool)
			admin.PUT("/tools/:id", UpdateTool)
			admin.DELETE("/tools/:id", DeleteTool)
			admin.GET("/stats", GetAdminStats)
		}
	}

	// Root health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"service": "tion-backend",
			"version": "1.0.0",
		})
	})
}

// HealthCheck returns API health status
func HealthCheck(c *gin.Context) {
	response.Success(c, gin.H{
		"status":  "healthy",
		"service": "tion-backend",
		"version": "1.0.0",
	})
}

// GetTools gets all tools
func GetTools(c *gin.Context) {
	// This will be implemented in the services
	response.Success(c, gin.H{
		"tools": []gin.H{},
		"total": 0,
	})
}

// GetTool gets a specific tool by ID
func GetTool(c *gin.Context) {
	// This will be implemented in the services
	response.Success(c, gin.H{
		"tool": gin.H{},
	})
}

// CreateTool creates a new tool
func CreateTool(c *gin.Context) {
	// This will be implemented in the services
	response.Success(c, gin.H{
		"message": "Tool created successfully",
	})
}

// UpdateTool updates an existing tool
func UpdateTool(c *gin.Context) {
	// This will be implemented in the services
	response.Success(c, gin.H{
		"message": "Tool updated successfully",
	})
}

// DeleteTool deletes a tool
func DeleteTool(c *gin.Context) {
	// This will be implemented in the services
	response.Success(c, gin.H{
		"message": "Tool deleted successfully",
	})
}

// RecordToolUsage records tool usage
func RecordToolUsage(c *gin.Context) {
	// This will be implemented in the services
	response.Success(c, gin.H{
		"message": "Usage recorded successfully",
	})
}

// GetToolStats gets tool statistics
func GetToolStats(c *gin.Context) {
	// This will be implemented in the services
	response.Success(c, gin.H{
		"stats": gin.H{},
	})
}

// GetUsageStats gets usage statistics
func GetUsageStats(c *gin.Context) {
	// This will be implemented in the services
	response.Success(c, gin.H{
		"usage": gin.H{},
	})
}

// GetOverviewStats gets overview statistics
func GetOverviewStats(c *gin.Context) {
	// This will be implemented in the services
	response.Success(c, gin.H{
		"overview": gin.H{},
	})
}

// GetAdminStats gets admin statistics
func GetAdminStats(c *gin.Context) {
	// This will be implemented in the services
	response.Success(c, gin.H{
		"admin_stats": gin.H{},
	})
}
