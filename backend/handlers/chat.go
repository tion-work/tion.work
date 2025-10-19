package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"tion.work/backend/services"
)

// ChatHandler 聊天处理器
type ChatHandler struct {
	cursorService *services.CursorService
}

// NewChatHandler 创建新的聊天处理器
func NewChatHandler(cursorService *services.CursorService) *ChatHandler {
	return &ChatHandler{
		cursorService: cursorService,
	}
}

// ChatRequest 聊天请求结构
type ChatRequest struct {
	Project string `json:"project"`
	Prompt  string `json:"prompt"`
	Type    string `json:"type,omitempty"` // "chat", "review", "analyze", "security", "performance"
}

// ChatResponse 聊天响应结构
type ChatResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

// HandleChat 处理聊天请求
func (h *ChatHandler) HandleChat(c *gin.Context) {
	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ChatResponse{
			Success: false,
			Error:   "无效的请求格式",
		})
		return
	}

	// 验证请求参数
	if req.Project == "" {
		c.JSON(http.StatusBadRequest, ChatResponse{
			Success: false,
			Error:   "项目名称不能为空",
		})
		return
	}

	if req.Prompt == "" {
		c.JSON(http.StatusBadRequest, ChatResponse{
			Success: false,
			Error:   "提示内容不能为空",
		})
		return
	}

	// 设置 CORS 头
	c.Header("Access-Control-Allow-Origin", "*")
	c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	c.Header("Access-Control-Allow-Headers", "Content-Type")

	// 设置 SSE 头
	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")

	// 创建 SSE 流
	flusher, ok := c.Writer.(http.Flusher)
	if !ok {
		c.JSON(http.StatusInternalServerError, ChatResponse{
			Success: false,
			Error:   "不支持流式响应",
		})
		return
	}

	// 发送开始事件
	fmt.Fprintf(c.Writer, "data: %s\n\n", `{"type":"start","message":"开始执行 AI 任务..."}`)
	flusher.Flush()

	// 执行 Cursor Agent 命令
	err := h.cursorService.ExecuteCommandStream(req.Project, req.Prompt, func(line string) {
		// 发送数据事件
		response := map[string]interface{}{
			"type":    "data",
			"message": line,
			"time":    time.Now().Format(time.RFC3339),
		}

		jsonData, _ := json.Marshal(response)
		fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
		flusher.Flush()
	})

	if err != nil {
		// 发送错误事件
		errorResponse := map[string]interface{}{
			"type":    "error",
			"message": fmt.Sprintf("执行失败: %v", err),
			"time":    time.Now().Format(time.RFC3339),
		}

		jsonData, _ := json.Marshal(errorResponse)
		fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
		flusher.Flush()
		return
	}

	// 发送完成事件
	completeResponse := map[string]interface{}{
		"type":    "complete",
		"message": "任务执行完成",
		"time":    time.Now().Format(time.RFC3339),
	}

	jsonData, _ := json.Marshal(completeResponse)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()
}

// HandleChatSimple 处理简单聊天请求（非流式）
func (h *ChatHandler) HandleChatSimple(c *gin.Context) {
	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ChatResponse{
			Success: false,
			Error:   "无效的请求格式",
		})
		return
	}

	// 验证请求参数
	if req.Project == "" {
		c.JSON(http.StatusBadRequest, ChatResponse{
			Success: false,
			Error:   "项目名称不能为空",
		})
		return
	}

	if req.Prompt == "" {
		c.JSON(http.StatusBadRequest, ChatResponse{
			Success: false,
			Error:   "提示内容不能为空",
		})
		return
	}

	// 执行 Cursor Agent 命令
	var result strings.Builder
	err := h.cursorService.ExecuteCommand(req.Project, req.Prompt, func(line string) {
		result.WriteString(line + "\n")
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, ChatResponse{
			Success: false,
			Error:   fmt.Sprintf("执行失败: %v", err),
		})
		return
	}

	c.JSON(http.StatusOK, ChatResponse{
		Success: true,
		Message: result.String(),
	})
}

// HandleReview 处理代码审查请求
func (h *ChatHandler) HandleReview(c *gin.Context) {
	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ChatResponse{
			Success: false,
			Error:   "无效的请求格式",
		})
		return
	}

	// 构建审查提示词
	reviewPrompt := fmt.Sprintf("请对项目 %s 进行代码审查，重点关注代码质量、安全性、性能和最佳实践。", req.Project)
	if req.Prompt != "" {
		reviewPrompt = fmt.Sprintf("%s\n\n具体要求：%s", reviewPrompt, req.Prompt)
	}

	// 设置请求类型为审查
	req.Type = "review"
	req.Prompt = reviewPrompt

	// 调用聊天处理器
	h.HandleChat(c)
}

// HandleAnalyze 处理架构分析请求
func (h *ChatHandler) HandleAnalyze(c *gin.Context) {
	var req ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ChatResponse{
			Success: false,
			Error:   "无效的请求格式",
		})
		return
	}

	// 构建分析提示词
	analyzePrompt := fmt.Sprintf("请对项目 %s 进行架构分析，包括系统设计、组件结构、依赖关系和技术栈评估。", req.Project)
	if req.Prompt != "" {
		analyzePrompt = fmt.Sprintf("%s\n\n具体要求：%s", analyzePrompt, req.Prompt)
	}

	// 设置请求类型为分析
	req.Type = "analyze"
	req.Prompt = analyzePrompt

	// 调用聊天处理器
	h.HandleChat(c)
}
