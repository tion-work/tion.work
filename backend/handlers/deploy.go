package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"tion.work/backend/services"
)

// DeployHandler 部署处理器
type DeployHandler struct {
	netlifyService *services.NetlifyService
}

// NewDeployHandler 创建新的部署处理器
func NewDeployHandler(netlifyService *services.NetlifyService) *DeployHandler {
	return &DeployHandler{
		netlifyService: netlifyService,
	}
}

// DeployRequest 部署请求
type DeployRequest struct {
	Project string `json:"project"`
}

// DeployResponse 部署响应
type DeployResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	URL     string `json:"url,omitempty"`
	Error   string `json:"error,omitempty"`
}

// DeployStatusResponse 部署状态响应
type DeployStatusResponse struct {
	Success bool                   `json:"success"`
	Status  map[string]interface{} `json:"status"`
	Error   string                 `json:"error,omitempty"`
}

// HandleDeploy 处理部署请求
func (h *DeployHandler) HandleDeploy(c *gin.Context) {
	var req DeployRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, DeployResponse{
			Success: false,
			Error:   "无效的请求格式",
		})
		return
	}

	// 验证请求参数
	if req.Project == "" {
		c.JSON(http.StatusBadRequest, DeployResponse{
			Success: false,
			Error:   "项目名称不能为空",
		})
		return
	}

	// 检查 Netlify 服务是否可用
	if h.netlifyService == nil {
		c.JSON(http.StatusServiceUnavailable, DeployResponse{
			Success: false,
			Error:   "Netlify 服务未配置",
		})
		return
	}

	// 执行部署
	deployResp, err := h.netlifyService.DeployProjectFromPath(req.Project, h.netlifyService.Workspace)
	if err != nil {
		c.JSON(http.StatusInternalServerError, DeployResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, DeployResponse{
		Success: true,
		Message: "部署成功",
		URL:     deployResp.URL,
	})
}

// HandleDeployStatus 处理部署状态查询
func (h *DeployHandler) HandleDeployStatus(c *gin.Context) {
	deployID := c.Param("deployId")
	if deployID == "" {
		c.JSON(http.StatusBadRequest, DeployStatusResponse{
			Success: false,
			Error:   "部署 ID 不能为空",
		})
		return
	}

	// 检查 Netlify 服务是否可用
	if h.netlifyService == nil {
		c.JSON(http.StatusServiceUnavailable, DeployStatusResponse{
			Success: false,
			Error:   "Netlify 服务未配置",
		})
		return
	}

	// 获取部署状态
	status, err := h.netlifyService.GetDeployStatus(deployID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, DeployStatusResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	// 转换为 map
	statusMap := map[string]interface{}{
		"id":     status.ID,
		"state":  status.State,
		"url":    status.URL,
		"error":  status.Error,
		"ready":  status.Ready,
		"failed": status.Failed,
	}

	c.JSON(http.StatusOK, DeployStatusResponse{
		Success: true,
		Status:  statusMap,
	})
}

// HandleGetSiteInfo 获取站点信息
func (h *DeployHandler) HandleGetSiteInfo(c *gin.Context) {
	// 检查 Netlify 服务是否可用
	if h.netlifyService == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"success": false,
			"error":   "Netlify 服务未配置",
		})
		return
	}

	// 获取站点信息
	siteInfo, err := h.netlifyService.GetSiteInfo()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"site":    siteInfo,
	})
}

// HandleDeployWithStream 处理流式部署请求
func (h *DeployHandler) HandleDeployWithStream(c *gin.Context) {
	var req DeployRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, DeployResponse{
			Success: false,
			Error:   "无效的请求格式",
		})
		return
	}

	// 验证请求参数
	if req.Project == "" {
		c.JSON(http.StatusBadRequest, DeployResponse{
			Success: false,
			Error:   "项目名称不能为空",
		})
		return
	}

	// 检查 Netlify 服务是否可用
	if h.netlifyService == nil {
		c.JSON(http.StatusServiceUnavailable, DeployResponse{
			Success: false,
			Error:   "Netlify 服务未配置",
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
		c.JSON(http.StatusInternalServerError, DeployResponse{
			Success: false,
			Error:   "不支持流式响应",
		})
		return
	}

	// 发送开始事件
	fmt.Fprintf(c.Writer, "data: %s\n\n", `{"type":"start","message":"开始部署项目..."}`)
	flusher.Flush()

	// 执行部署
	deployResp, err := h.netlifyService.DeployProjectFromPath(req.Project, h.netlifyService.Workspace)
	if err != nil {
		// 发送错误事件
		errorResponse := map[string]interface{}{
			"type":    "error",
			"message": fmt.Sprintf("部署失败: %v", err),
		}

		jsonData, _ := json.Marshal(errorResponse)
		fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
		flusher.Flush()
		return
	}

	// 发送完成事件
	completeResponse := map[string]interface{}{
		"type":    "complete",
		"message": "部署完成",
		"url":     deployResp.URL,
	}

	jsonData, _ := json.Marshal(completeResponse)
	fmt.Fprintf(c.Writer, "data: %s\n\n", string(jsonData))
	flusher.Flush()
}
