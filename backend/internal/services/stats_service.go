package services

import (
	"time"
	"tion-backend/internal/database"
	"tion-backend/internal/models"

	"gorm.io/gorm"
)

type StatsService struct {
	db *gorm.DB
}

func NewStatsService() *StatsService {
	return &StatsService{
		db: database.GetDB(),
	}
}

// GetToolStats gets statistics for all tools
func (s *StatsService) GetToolStats() (map[string]interface{}, error) {
	var totalTools int64
	var activeTools int64
	var categories []string

	// Count total tools
	s.db.Model(&models.Tool{}).Count(&totalTools)

	// Count active tools
	s.db.Model(&models.Tool{}).Where("is_active = ?", true).Count(&activeTools)

	// Get unique categories
	s.db.Model(&models.Tool{}).Distinct("category").Pluck("category", &categories)

	return map[string]interface{}{
		"total_tools":   totalTools,
		"active_tools":  activeTools,
		"categories":    categories,
		"total_categories": len(categories),
	}, nil
}

// GetUsageStats gets usage statistics
func (s *StatsService) GetUsageStats(days int) (map[string]interface{}, error) {
	var totalUsage int64
	var todayUsage int64
	var weekUsage int64

	// Count total usage
	s.db.Model(&models.ToolUsage{}).Count(&totalUsage)

	// Count today's usage
	today := time.Now().Truncate(24 * time.Hour)
	s.db.Model(&models.ToolUsage{}).Where("created_at >= ?", today).Count(&todayUsage)

	// Count this week's usage
	weekAgo := time.Now().AddDate(0, 0, -days)
	s.db.Model(&models.ToolUsage{}).Where("created_at >= ?", weekAgo).Count(&weekUsage)

	return map[string]interface{}{
		"total_usage": totalUsage,
		"today_usage": todayUsage,
		"week_usage":  weekUsage,
		"period_days": days,
	}, nil
}

// GetToolUsageStats gets usage stats for a specific tool
func (s *StatsService) GetToolUsageStats(toolID uint, days int) (map[string]interface{}, error) {
	var totalUsage int64
	var recentUsage int64

	// Count total usage for tool
	s.db.Model(&models.ToolUsage{}).Where("tool_id = ?", toolID).Count(&totalUsage)

	// Count recent usage
	recentDate := time.Now().AddDate(0, 0, -days)
	s.db.Model(&models.ToolUsage{}).Where("tool_id = ? AND created_at >= ?", toolID, recentDate).Count(&recentUsage)

	return map[string]interface{}{
		"tool_id":       toolID,
		"total_usage":   totalUsage,
		"recent_usage":  recentUsage,
		"period_days":   days,
	}, nil
}

// RecordToolUsage records a tool usage
func (s *StatsService) RecordToolUsage(toolID uint, ipAddress, userAgent string) error {
	usage := &models.ToolUsage{
		ToolID:    toolID,
		IPAddress: ipAddress,
		UserAgent: userAgent,
		CreatedAt: time.Now(),
	}
	return s.db.Create(usage).Error
}

// GetOverviewStats gets overview statistics
func (s *StatsService) GetOverviewStats() (map[string]interface{}, error) {
	var totalTools int64
	var totalUsage int64
	var todayUsage int64

	// Count tools
	s.db.Model(&models.Tool{}).Where("is_active = ?", true).Count(&totalTools)

	// Count total usage
	s.db.Model(&models.ToolUsage{}).Count(&totalUsage)

	// Count today's usage
	today := time.Now().Truncate(24 * time.Hour)
	s.db.Model(&models.ToolUsage{}).Where("created_at >= ?", today).Count(&todayUsage)

	return map[string]interface{}{
		"total_tools":  totalTools,
		"total_usage":  totalUsage,
		"today_usage":  todayUsage,
		"last_updated": time.Now(),
	}, nil
}
