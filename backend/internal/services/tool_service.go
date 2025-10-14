package services

import (
	"tion-backend/internal/database"
	"tion-backend/internal/models"

	"gorm.io/gorm"
)

type ToolService struct {
	db *gorm.DB
}

func NewToolService() *ToolService {
	return &ToolService{
		db: database.GetDB(),
	}
}

// GetAllTools gets all active tools
func (s *ToolService) GetAllTools() ([]models.Tool, error) {
	var tools []models.Tool
	err := s.db.Where("is_active = ?", true).Find(&tools).Error
	return tools, err
}

// GetToolByID gets a tool by ID
func (s *ToolService) GetToolByID(id uint) (*models.Tool, error) {
	var tool models.Tool
	err := s.db.Where("id = ? AND is_active = ?", id, true).First(&tool).Error
	if err != nil {
		return nil, err
	}
	return &tool, nil
}

// CreateTool creates a new tool
func (s *ToolService) CreateTool(tool *models.Tool) error {
	return s.db.Create(tool).Error
}

// UpdateTool updates an existing tool
func (s *ToolService) UpdateTool(id uint, updates map[string]interface{}) error {
	return s.db.Model(&models.Tool{}).Where("id = ?", id).Updates(updates).Error
}

// DeleteTool soft deletes a tool
func (s *ToolService) DeleteTool(id uint) error {
	return s.db.Delete(&models.Tool{}, id).Error
}

// GetToolsByCategory gets tools by category
func (s *ToolService) GetToolsByCategory(category string) ([]models.Tool, error) {
	var tools []models.Tool
	err := s.db.Where("category = ? AND is_active = ?", category, true).Find(&tools).Error
	return tools, err
}

// SearchTools searches tools by name or description
func (s *ToolService) SearchTools(query string) ([]models.Tool, error) {
	var tools []models.Tool
	err := s.db.Where("(name ILIKE ? OR description ILIKE ?) AND is_active = ?",
		"%"+query+"%", "%"+query+"%", true).Find(&tools).Error
	return tools, err
}
