package main

import (
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"tion.work/backend/handlers"
	"tion.work/backend/services"
)

func main() {
	// 加载配置
	config := services.LoadConfig()

	// 验证配置
	if err := config.Validate(); err != nil {
		log.Fatalf("配置验证失败: %v", err)
	}

	// 设置 Gin 模式
	if config.Debug {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	// 创建路由器
	r := gin.Default()

	// 配置 CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// 创建服务
	cursorService := services.NewCursorService(config.CursorAPIKey, config.Workspace)
	gitService := services.NewGitService(config.Workspace, config.GitHubToken)

	var netlifyService *services.NetlifyService
	if config.IsNetlifyConfigured() {
		netlifyService = services.NewNetlifyService(config.NetlifyAuthToken, config.NetlifySiteID, config.Workspace)
	}

	// 创建处理器
	chatHandler := handlers.NewChatHandler(cursorService)
	projectHandler := handlers.NewProjectHandler(cursorService, gitService)
	gitHandler := handlers.NewGitHandler(gitService)
	streamHandler := handlers.NewStreamHandler(cursorService)
	monitorHandler := handlers.NewMonitorHandler(cursorService, gitService)

	var deployHandler *handlers.DeployHandler
	if netlifyService != nil {
		deployHandler = handlers.NewDeployHandler(netlifyService)
	}

	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "ok",
			"message":   "AI 开发助手服务运行正常",
			"workspace": config.Workspace,
			"version":   "1.0.0",
		})
	})

	// 静态文件服务
	r.Static("/static", "./static")
	r.StaticFile("/", "./templates/enhanced-chat-app.html")
	r.StaticFile("/chat", "./templates/chat-app.html") // 保留原版本

	// API 路由组
	api := r.Group("/api")
	{
		// 聊天相关
		api.POST("/chat", chatHandler.HandleChat)
		api.POST("/chat/simple", chatHandler.HandleChatSimple)
		api.POST("/review", chatHandler.HandleReview)
		api.POST("/analyze", chatHandler.HandleAnalyze)

		// 项目管理
		api.GET("/projects", projectHandler.HandleGetProjects)
		api.GET("/projects/:project", projectHandler.HandleGetProjectInfo)
		api.GET("/projects/:project/status", projectHandler.HandleGetGitStatus)
		api.POST("/projects/:project/install", projectHandler.HandleInstallDependencies)
		api.POST("/projects/:project/build", projectHandler.HandleBuildProject)
		api.POST("/projects/:project/validate", projectHandler.HandleValidateProject)

		// Git 操作
		api.POST("/git/commit", gitHandler.HandleCommit)
		api.POST("/git/push", gitHandler.HandlePush)
		api.POST("/git/branch", gitHandler.HandleCreateBranch)
		api.POST("/git/switch", gitHandler.HandleSwitchBranch)
		api.GET("/git/:project/branches", gitHandler.HandleGetBranches)
		api.GET("/git/:project/diff", gitHandler.HandleGetDiff)
		api.POST("/git/:project/reset", gitHandler.HandleResetChanges)

		// 流式输出
		api.POST("/stream/command", streamHandler.HandleStreamCommand)
		api.GET("/stream/:project/logs", streamHandler.HandleStreamLogs)

		// 监控面板
		api.GET("/monitor/stats", monitorHandler.HandleGetSystemStats)
		api.GET("/monitor/projects", monitorHandler.HandleGetProjectStats)
		api.GET("/monitor/health", monitorHandler.HandleGetServiceHealth)

		// 部署相关
		if deployHandler != nil {
			api.POST("/deploy", deployHandler.HandleDeploy)
			api.POST("/deploy/stream", deployHandler.HandleDeployWithStream)
			api.GET("/deploy/:deployId/status", deployHandler.HandleDeployStatus)
			api.GET("/deploy/site/info", deployHandler.HandleGetSiteInfo)
		}
	}

	// 启动服务器
	port := config.GetServerAddress()
	log.Printf("🚀 AI 开发助手服务器启动在端口 %s", port)
	log.Printf("📁 工作目录: %s", config.Workspace)
	log.Printf("🔧 Cursor API Key: %s", maskAPIKey(config.CursorAPIKey))

	if config.IsGitHubConfigured() {
		log.Printf("🐙 GitHub 仓库: %s", config.GitHubRepo)
	}

	if config.IsNetlifyConfigured() {
		log.Printf("🌐 Netlify 站点: %s", config.NetlifySiteID)
	}

	if err := r.Run(port); err != nil {
		log.Fatalf("服务器启动失败: %v", err)
	}
}

// maskAPIKey 遮蔽 API 密钥
func maskAPIKey(apiKey string) string {
	if len(apiKey) <= 8 {
		return "***"
	}
	return apiKey[:4] + "***" + apiKey[len(apiKey)-4:]
}
