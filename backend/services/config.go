package services

import (
	"fmt"
	"os"
	"strconv"
)

// Config 配置结构
type Config struct {
	// 服务器配置
	Port string

	// 工作空间配置
	Workspace string

	// GitHub 配置
	GitHubRepo  string
	GitHubToken string

	// Cursor 配置
	CursorAPIKey string

	// Netlify 配置
	NetlifyAuthToken string
	NetlifySiteID    string

	// 其他配置
	Debug bool
}

// LoadConfig 加载配置
func LoadConfig() *Config {
	config := &Config{
		// 默认值
		Port:      "8080",
		Workspace: "/workspace",
		Debug:     false,
	}

	// 从环境变量加载配置
	if port := os.Getenv("PORT"); port != "" {
		config.Port = port
	}

	if workspace := os.Getenv("WORKSPACE"); workspace != "" {
		config.Workspace = workspace
	}

	if repo := os.Getenv("GITHUB_REPO"); repo != "" {
		config.GitHubRepo = repo
	}

	if token := os.Getenv("GITHUB_TOKEN"); token != "" {
		config.GitHubToken = token
	}

	if apiKey := os.Getenv("CURSOR_API_KEY"); apiKey != "" {
		config.CursorAPIKey = apiKey
	}

	if authToken := os.Getenv("NETLIFY_AUTH_TOKEN"); authToken != "" {
		config.NetlifyAuthToken = authToken
	}

	if siteID := os.Getenv("NETLIFY_SITE_ID"); siteID != "" {
		config.NetlifySiteID = siteID
	}

	if debug := os.Getenv("DEBUG"); debug != "" {
		if parsed, err := strconv.ParseBool(debug); err == nil {
			config.Debug = parsed
		}
	}

	return config
}

// Validate 验证配置
func (c *Config) Validate() error {
	if c.Port == "" {
		return fmt.Errorf("PORT 环境变量未设置")
	}

	if c.Workspace == "" {
		return fmt.Errorf("WORKSPACE 环境变量未设置")
	}

	if c.CursorAPIKey == "" {
		return fmt.Errorf("CURSOR_API_KEY 环境变量未设置")
	}

	return nil
}

// GetServerAddress 获取服务器地址
func (c *Config) GetServerAddress() string {
	return ":" + c.Port
}

// IsGitHubConfigured 检查 GitHub 是否已配置
func (c *Config) IsGitHubConfigured() bool {
	return c.GitHubRepo != "" && c.GitHubToken != ""
}

// IsNetlifyConfigured 检查 Netlify 是否已配置
func (c *Config) IsNetlifyConfigured() bool {
	return c.NetlifyAuthToken != "" && c.NetlifySiteID != ""
}
