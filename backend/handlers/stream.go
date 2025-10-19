package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"tion.work/backend/services"
)

// StreamHandler 流式输出处理器
type StreamHandler struct {
	cursorService *services.CursorService
}

// NewStreamHandler 创建新的流式输出处理器
func NewStreamHandler(cursorService *services.CursorService) *StreamHandler {
	return &StreamHandler{
		cursorService: cursorService,
	}
}

// StreamRequest 流式请求
type StreamRequest struct {
	Project string `json:"project"`
	Command string `json:"command"`
	Type    string `json:"type,omitempty"` // "build", "test", "install", "custom"
}

// StreamMessage 流式消息
type StreamMessage struct {
	Type      string    `json:"type"`
	Message   string    `json:"message"`
	Timestamp time.Time `json:"timestamp"`
	Project   string    `json:"project,omitempty"`
	Command   string    `json:"command,omitempty"`
}

// HandleStreamCommand 处理流式命令执行
func (h *StreamHandler) HandleStreamCommand(c *gin.Context) {
	var req StreamRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "无效的请求格式",
		})
		return
	}

	// 验证请求参数
	if req.Project == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "项目名称不能为空",
		})
		return
	}

	if req.Command == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "命令不能为空",
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
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "不支持流式响应",
		})
		return
	}

	// 发送开始事件
	startMsg := StreamMessage{
		Type:      "start",
		Message:   fmt.Sprintf("开始执行命令: %s", req.Command),
		Timestamp: time.Now(),
		Project:   req.Project,
		Command:   req.Command,
	}

	jsonData, _ := json.Marshal(startMsg)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()

	// 根据命令类型执行不同的操作
	var err error
	switch req.Type {
	case "build":
		err = h.handleBuildCommand(req.Project, c, flusher)
	case "test":
		err = h.handleTestCommand(req.Project, c, flusher)
	case "install":
		err = h.handleInstallCommand(req.Project, c, flusher)
	default:
		err = h.handleCustomCommand(req.Project, req.Command, c, flusher)
	}

	if err != nil {
		// 发送错误事件
		errorMsg := StreamMessage{
			Type:      "error",
			Message:   fmt.Sprintf("命令执行失败: %v", err),
			Timestamp: time.Now(),
			Project:   req.Project,
			Command:   req.Command,
		}

		jsonData, _ := json.Marshal(errorMsg)
		fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
		flusher.Flush()
		return
	}

	// 发送完成事件
	completeMsg := StreamMessage{
		Type:      "complete",
		Message:   "命令执行完成",
		Timestamp: time.Now(),
		Project:   req.Project,
		Command:   req.Command,
	}

	jsonData, _ = json.Marshal(completeMsg)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()
}

// handleBuildCommand 处理构建命令
func (h *StreamHandler) handleBuildCommand(project string, c *gin.Context, flusher http.Flusher) error {
	// 发送构建开始消息
	msg := StreamMessage{
		Type:      "info",
		Message:   "开始构建项目...",
		Timestamp: time.Now(),
		Project:   project,
	}

	jsonData, _ := json.Marshal(msg)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()

	// 执行构建
	err := h.cursorService.BuildProject(project)
	if err != nil {
		return err
	}

	// 发送构建完成消息
	msg = StreamMessage{
		Type:      "success",
		Message:   "项目构建完成",
		Timestamp: time.Now(),
		Project:   project,
	}

	jsonData, _ = json.Marshal(msg)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()

	return nil
}

// handleTestCommand 处理测试命令
func (h *StreamHandler) handleTestCommand(project string, c *gin.Context, flusher http.Flusher) error {
	// 发送测试开始消息
	msg := StreamMessage{
		Type:      "info",
		Message:   "开始运行测试...",
		Timestamp: time.Now(),
		Project:   project,
	}

	jsonData, _ := json.Marshal(msg)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()

	// 这里可以添加测试执行逻辑
	// 目前只是模拟
	time.Sleep(2 * time.Second)

	// 发送测试完成消息
	msg = StreamMessage{
		Type:      "success",
		Message:   "测试运行完成",
		Timestamp: time.Now(),
		Project:   project,
	}

	jsonData, _ = json.Marshal(msg)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()

	return nil
}

// handleInstallCommand 处理安装命令
func (h *StreamHandler) handleInstallCommand(project string, c *gin.Context, flusher http.Flusher) error {
	// 发送安装开始消息
	msg := StreamMessage{
		Type:      "info",
		Message:   "开始安装依赖...",
		Timestamp: time.Now(),
		Project:   project,
	}

	jsonData, _ := json.Marshal(msg)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()

	// 执行安装
	err := h.cursorService.InstallDependencies(project)
	if err != nil {
		return err
	}

	// 发送安装完成消息
	msg = StreamMessage{
		Type:      "success",
		Message:   "依赖安装完成",
		Timestamp: time.Now(),
		Project:   project,
	}

	jsonData, _ = json.Marshal(msg)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()

	return nil
}

// handleCustomCommand 处理自定义命令
func (h *StreamHandler) handleCustomCommand(project, command string, c *gin.Context, flusher http.Flusher) error {
	// 发送命令开始消息
	msg := StreamMessage{
		Type:      "info",
		Message:   fmt.Sprintf("执行自定义命令: %s", command),
		Timestamp: time.Now(),
		Project:   project,
		Command:   command,
	}

	jsonData, _ := json.Marshal(msg)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()

	// 这里可以添加自定义命令执行逻辑
	// 目前只是模拟
	time.Sleep(1 * time.Second)

	// 发送命令完成消息
	msg = StreamMessage{
		Type:      "success",
		Message:   "自定义命令执行完成",
		Timestamp: time.Now(),
		Project:   project,
		Command:   command,
	}

	jsonData, _ = json.Marshal(msg)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()

	return nil
}

// HandleStreamLogs 处理流式日志
func (h *StreamHandler) HandleStreamLogs(c *gin.Context) {
	project := c.Param("project")
	if project == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "项目名称不能为空",
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
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "不支持流式响应",
		})
		return
	}

	// 发送开始事件
	startMsg := StreamMessage{
		Type:      "start",
		Message:   fmt.Sprintf("开始监控项目 %s 的日志", project),
		Timestamp: time.Now(),
		Project:   project,
	}

	jsonData, _ := json.Marshal(startMsg)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()

	// 这里可以添加实时日志监控逻辑
	// 目前只是模拟
	for i := 0; i < 10; i++ {
		msg := StreamMessage{
			Type:      "log",
			Message:   fmt.Sprintf("日志消息 %d", i+1),
			Timestamp: time.Now(),
			Project:   project,
		}

		jsonData, _ := json.Marshal(msg)
		fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
		flusher.Flush()

		time.Sleep(1 * time.Second)
	}

	// 发送结束事件
	endMsg := StreamMessage{
		Type:      "end",
		Message:   "日志监控结束",
		Timestamp: time.Now(),
		Project:   project,
	}

	jsonData, _ = json.Marshal(endMsg)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()
}
