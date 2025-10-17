package main

import (
	"bufio"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"sync"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// ChatRequest 聊天请求结构
type ChatRequest struct {
	Message string `json:"message"`
	Action  string `json:"action,omitempty"`
	File    string `json:"file,omitempty"`
}

// ChatResponse 聊天响应结构
type ChatResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Result  string `json:"result,omitempty"`
	Error   string `json:"error,omitempty"`
}

// CursorAgentService Cursor Agent 服务
type CursorAgentService struct {
	APIKey string
}

// NewCursorAgentService 创建新的 Cursor Agent 服务
func NewCursorAgentService(apiKey string) *CursorAgentService {
	return &CursorAgentService{
		APIKey: apiKey,
	}
}

// ExecuteCommand 执行 Cursor Agent 命令
func (s *CursorAgentService) ExecuteCommand(message string) (string, error) {
	// 构建 Cursor Agent 命令
	cmd := exec.Command("cursor-agent",
		"--api-key", s.APIKey,
		"--print", message,
	)

	// 设置工作目录为项目目录
	cmd.Dir = "/workspace/tion.work"

	// 执行命令并获取输出
	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("执行 Cursor Agent 失败: %v, 输出: %s", err, string(output))
	}

	return string(output), nil
}

// ExecuteCommandStream 流式执行 Cursor Agent 命令
func (s *CursorAgentService) ExecuteCommandStream(message string, onChunk func(string)) error {
	// 构建 Cursor Agent 命令
	cmd := exec.Command("cursor-agent",
		"--api-key", s.APIKey,
		"--print", message,
	)

	// 设置工作目录为项目目录
	cmd.Dir = "/workspace/tion.work"

	// 创建管道
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return fmt.Errorf("创建输出管道失败: %v", err)
	}

	stderr, err := cmd.StderrPipe()
	if err != nil {
		return fmt.Errorf("创建错误管道失败: %v", err)
	}

	// 启动命令
	if err := cmd.Start(); err != nil {
		return fmt.Errorf("启动命令失败: %v", err)
	}

	// 使用 WaitGroup 等待所有 goroutine 完成
	var wg sync.WaitGroup
	wg.Add(2)

	// 读取标准输出
	go func() {
		defer wg.Done()
		scanner := bufio.NewScanner(stdout)
		for scanner.Scan() {
			onChunk(scanner.Text() + "\n")
		}
	}()

	// 读取标准错误
	go func() {
		defer wg.Done()
		scanner := bufio.NewScanner(stderr)
		for scanner.Scan() {
			onChunk(scanner.Text() + "\n")
		}
	}()

	// 等待所有读取完成
	wg.Wait()

	// 等待命令完成
	if err := cmd.Wait(); err != nil {
		return fmt.Errorf("命令执行失败: %v", err)
	}

	return nil
}

func main() {
	// 获取 API Key
	apiKey := "key_a41791e71f6b02ffe959a88b1f4467387175b3bf93c4471bf9b9b813c2987e9d"

	// 创建 Cursor Agent 服务
	cursorService := NewCursorAgentService(apiKey)

	// 创建 Gin 路由
	r := gin.Default()

	// 配置 CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"*"},
		AllowCredentials: true,
	}))

	// 静态文件服务
	r.Static("/static", "/workspace")
	r.GET("/", func(c *gin.Context) {
		c.File("/workspace/templates/chat-app.html")
	})

	// 健康检查
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"service": "chat-api",
		})
	})

	// 聊天 API
	r.POST("/api/chat", func(c *gin.Context) {
		var req ChatRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, ChatResponse{
				Success: false,
				Error:   "无效的请求格式",
			})
			return
		}

		// 构建完整的消息
		fullMessage := req.Message
		if req.Action != "" {
			fullMessage = fmt.Sprintf("执行操作: %s\n文件: %s\n任务: %s",
				req.Action, req.File, req.Message)
		}

		// 设置 Server-Sent Events 响应头
		c.Header("Content-Type", "text/event-stream")
		c.Header("Cache-Control", "no-cache")
		c.Header("Connection", "keep-alive")
		c.Header("Access-Control-Allow-Origin", "*")

		// 发送开始事件
		c.Writer.WriteString("data: {\"type\":\"start\",\"message\":\"开始执行命令...\"}\n\n")
		c.Writer.Flush()

		// 执行 Cursor Agent 命令并流式返回结果
		err := cursorService.ExecuteCommandStream(fullMessage, func(chunk string) {
			// 发送增量数据
			escapedChunk := strings.ReplaceAll(chunk, "\n", "\\n")
			escapedChunk = strings.ReplaceAll(escapedChunk, "\"", "\\\"")
			c.Writer.WriteString(fmt.Sprintf("data: {\"type\":\"chunk\",\"content\":\"%s\"}\n\n", escapedChunk))
			c.Writer.Flush()
		})

		if err != nil {
			c.Writer.WriteString(fmt.Sprintf("data: {\"type\":\"error\",\"message\":\"%s\"}\n\n", err.Error()))
			c.Writer.Flush()
			return
		}

		// 发送完成事件
		c.Writer.WriteString("data: {\"type\":\"complete\",\"message\":\"命令执行完成\"}\n\n")
		c.Writer.Flush()
	})

	// 获取项目状态
	r.GET("/api/project/status", func(c *gin.Context) {
		// 检查项目目录是否存在
		cmd := exec.Command("ls", "-la", "/workspace/tion.work")
		output, err := cmd.CombinedOutput()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error": "无法访问项目目录",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"project_path": "/workspace/tion.work",
			"directory_listing": string(output),
		})
	})

	// 启动服务器
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	port = ":" + port
	fmt.Printf("🚀 聊天 API 服务启动在端口 %s\n", port)
	fmt.Printf("📁 项目目录: /workspace/tion.work\n")
	fmt.Printf("🤖 Cursor Agent 已配置\n")

	if err := r.Run(port); err != nil {
		log.Fatal("启动服务器失败:", err)
	}
}
