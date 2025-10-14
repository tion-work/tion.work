package main

import (
	"log"
	"tion-backend/internal/config"
	"tion-backend/internal/database"
	"tion-backend/internal/models"

	"gorm.io/gorm"
)

func main() {
	// Initialize configuration
	if err := config.InitConfig(); err != nil {
		log.Fatal("Failed to initialize config:", err)
	}

	// Initialize database
	if err := database.InitDatabase(); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	db := database.GetDB()

	// Seed tools data
	seedTools(db)

	log.Println("Database seeding completed successfully!")
}

func seedTools(db *gorm.DB) {
	tools := []models.Tool{
		{
			Name:        "收益计算器",
			Description: "计算加密货币投资收益率",
			Category:    "计算工具",
			Icon:        "Calculator",
			URL:         "/tools/calculator",
			IsActive:    true,
		},
		{
			Name:        "DCA定投计算器",
			Description: "定期定额投资策略计算",
			Category:    "计算工具",
			Icon:        "TrendingUp",
			URL:         "/tools/dca",
			IsActive:    true,
		},
		{
			Name:        "FIRE计算器",
			Description: "财务自由规划工具",
			Category:    "计算工具",
			Icon:        "Target",
			URL:         "/tools/fire",
			IsActive:    true,
		},
		{
			Name:        "地址验证器",
			Description: "验证加密货币地址有效性",
			Category:    "安全工具",
			Icon:        "Shield",
			URL:         "/tools/address-validator",
			IsActive:    true,
		},
		{
			Name:        "复利计算器",
			Description: "复利投资计算工具",
			Category:    "计算工具",
			Icon:        "BarChart3",
			URL:         "/tools/compound",
			IsActive:    true,
		},
		{
			Name:        "币安",
			Description: "全球最大加密货币交易所",
			Category:    "交易所",
			Icon:        "TrendingUp",
			URL:         "https://binance.com",
			IsActive:    true,
		},
		{
			Name:        "欧易",
			Description: "知名数字资产交易平台",
			Category:    "交易所",
			Icon:        "TrendingUp",
			URL:         "https://okx.com",
			IsActive:    true,
		},
		{
			Name:        "Coinbase",
			Description: "美国最大加密货币交易所",
			Category:    "交易所",
			Icon:        "TrendingUp",
			URL:         "https://coinbase.com",
			IsActive:    true,
		},
		{
			Name:        "Uniswap",
			Description: "去中心化交易协议",
			Category:    "DeFi协议",
			Icon:        "Globe",
			URL:         "https://uniswap.org",
			IsActive:    true,
		},
		{
			Name:        "Compound",
			Description: "借贷协议",
			Category:    "DeFi协议",
			Icon:        "Globe",
			URL:         "https://compound.finance",
			IsActive:    true,
		},
		{
			Name:        "CoinGecko",
			Description: "加密货币市场数据",
			Category:    "数据分析",
			Icon:        "BarChart3",
			URL:         "https://coingecko.com",
			IsActive:    true,
		},
		{
			Name:        "CoinMarketCap",
			Description: "市值排名平台",
			Category:    "数据分析",
			Icon:        "BarChart3",
			URL:         "https://coinmarketcap.com",
			IsActive:    true,
		},
		{
			Name:        "Etherscan",
			Description: "以太坊区块链浏览器",
			Category:    "区块链浏览器",
			Icon:        "Shield",
			URL:         "https://etherscan.io",
			IsActive:    true,
		},
		{
			Name:        "BSCScan",
			Description: "BSC区块链浏览器",
			Category:    "区块链浏览器",
			Icon:        "Shield",
			URL:         "https://bscscan.com",
			IsActive:    true,
		},
	}

	for _, tool := range tools {
		var existingTool models.Tool
		if err := db.Where("name = ?", tool.Name).First(&existingTool).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				if err := db.Create(&tool).Error; err != nil {
					log.Printf("Failed to create tool %s: %v", tool.Name, err)
				} else {
					log.Printf("Created tool: %s", tool.Name)
				}
			} else {
				log.Printf("Error checking tool %s: %v", tool.Name, err)
			}
		} else {
			log.Printf("Tool %s already exists", tool.Name)
		}
	}
}
