package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"tion.work/backend/services"
)

// ProjectHandler 项目管理处理器
type ProjectHandler struct {
	cursorService *services.CursorService
	gitService    *services.GitService
}

// NewProjectHandler 创建新的项目管理处理器
func NewProjectHandler(cursorService *services.CursorService, gitService *services.GitService) *ProjectHandler {
	return &ProjectHandler{
		cursorService: cursorService,
		gitService:    gitService,
	}
}

// ProjectListResponse 项目列表响应
type ProjectListResponse struct {
	Success bool     `json:"success"`
	Projects []string `json:"projects"`
	Error   string   `json:"error,omitempty"`
}

// ProjectInfoResponse 项目信息响应
type ProjectInfoResponse struct {
	Success bool                   `json:"success"`
	Project map[string]interface{} `json:"project"`
	Error   string                 `json:"error,omitempty"`
}

// GitStatusResponse Git 状态响应
type GitStatusResponse struct {
	Success bool                   `json:"success"`
	Status  map[string]interface{} `json:"status"`
	Error   string                 `json:"error,omitempty"`
}

// HandleGetProjects 获取项目列表
func (h *ProjectHandler) HandleGetProjects(c *gin.Context) {
	projects, err := h.cursorService.GetAvailableProjects()
	if err != nil {
		c.JSON(http.StatusInternalServerError, ProjectListResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, ProjectListResponse{
		Success:  true,
		Projects: projects,
	})
}

// HandleGetProjectInfo 获取项目信息
func (h *ProjectHandler) HandleGetProjectInfo(c *gin.Context) {
	project := c.Param("project")
	if project == "" {
		c.JSON(http.StatusBadRequest, ProjectInfoResponse{
			Success: false,
			Error:   "项目名称不能为空",
		})
		return
	}

	info, err := h.cursorService.GetProjectStatus(project)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ProjectInfoResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, ProjectInfoResponse{
		Success: true,
		Project: info,
	})
}

// HandleGetGitStatus 获取 Git 状态
func (h *ProjectHandler) HandleGetGitStatus(c *gin.Context) {
	project := c.Param("project")
	if project == "" {
		c.JSON(http.StatusBadRequest, GitStatusResponse{
			Success: false,
			Error:   "项目名称不能为空",
		})
		return
	}

	status, err := h.gitService.GetProjectGitStatus(project)
	if err != nil {
		c.JSON(http.StatusInternalServerError, GitStatusResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, GitStatusResponse{
		Success: true,
		Status:  status,
	})
}

// HandleInstallDependencies 安装项目依赖
func (h *ProjectHandler) HandleInstallDependencies(c *gin.Context) {
	project := c.Param("project")
	if project == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "项目名称不能为空",
		})
		return
	}

	err := h.cursorService.InstallDependencies(project)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "依赖安装完成",
	})
}

// HandleBuildProject 构建项目
func (h *ProjectHandler) HandleBuildProject(c *gin.Context) {
	project := c.Param("project")
	if project == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "项目名称不能为空",
		})
		return
	}

	err := h.cursorService.BuildProject(project)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "项目构建完成",
	})
}

// HandleValidateProject 验证项目
func (h *ProjectHandler) HandleValidateProject(c *gin.Context) {
	project := c.Param("project")
	if project == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "项目名称不能为空",
		})
		return
	}

	err := h.cursorService.ValidateProject(project)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"valid":   false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"valid":   true,
		"message": "项目验证通过",
	})
}
