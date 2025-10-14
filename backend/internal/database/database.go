package database

import (
	"tion-backend/internal/config"
	"tion-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func InitDatabase() error {
	var err error

	// Use PostgreSQL if DATABASE_URL is provided, otherwise use SQLite
	if config.AppConfig.DatabaseURL != "" {
		DB, err = gorm.Open(postgres.Open(config.AppConfig.DatabaseURL), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
	} else {
		DB, err = gorm.Open(sqlite.Open("tion.db"), &gorm.Config{
			Logger: logger.Default.LogMode(logger.Info),
		})
	}

	if err != nil {
		return err
	}

	// Auto migrate the schema
	if err := DB.AutoMigrate(
		&models.Tool{},
		&models.ToolUsage{},
		&models.APIKey{},
	); err != nil {
		return err
	}

	return nil
}

func GetDB() *gorm.DB {
	return DB
}
