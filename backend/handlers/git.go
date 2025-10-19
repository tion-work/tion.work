package handlers

import (
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"tion.work/backend/services"
)

// GitHandler Git 操作处理器
type GitHandler struct {
	gitService *services.GitService
}

// NewGitHandler 创建新的 Git 处理器
func NewGitHandler(gitService *services.GitService) *GitHandler {
	return &GitHandler{
		gitService: gitService,
	}
}

// GitCommitRequest Git 提交请求
type GitCommitRequest struct {
	Project string `json:"project"`
	Message string `json:"message"`
	Files   []string `json:"files,omitempty"`
}

// GitPushRequest Git 推送请求
type GitPushRequest struct {
	Project string `json:"project"`
	Branch  string `json:"branch"`
}

// GitBranchRequest Git 分支请求
type GitBranchRequest struct {
	Project string `json:"project"`
	Branch  string `json:"branch"`
}

// GitResponse Git 操作响应
type GitResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

// HandleCommit 处理提交请求
func (h *GitHandler) HandleCommit(c *gin.Context) {
	var req GitCommitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, GitResponse{
			Success: false,
			Error:   "无效的请求格式",
		})
		return
	}

	// 验证请求参数
	if req.Project == "" {
		c.JSON(http.StatusBadRequest, GitResponse{
			Success: false,
			Error:   "项目名称不能为空",
		})
		return
	}

	if req.Message == "" {
		c.JSON(http.StatusBadRequest, GitResponse{
			Success: false,
			Error:   "提交信息不能为空",
		})
		return
	}

	// 执行提交
	err := h.gitService.CommitProject(req.Project, req.Message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, GitResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, GitResponse{
		Success: true,
		Message: "提交成功",
	})
}

// HandlePush 处理推送请求
func (h *GitHandler) HandlePush(c *gin.Context) {
	var req GitPushRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, GitResponse{
			Success: false,
			Error:   "无效的请求格式",
		})
		return
	}

	// 验证请求参数
	if req.Project == "" {
		c.JSON(http.StatusBadRequest, GitResponse{
			Success: false,
			Error:   "项目名称不能为空",
		})
		return
	}

	if req.Branch == "" {
		req.Branch = "main" // 默认分支
	}

	// 执行推送
	err := h.gitService.PushProject(req.Project, req.Branch)
	if err != nil {
		c.JSON(http.StatusInternalServerError, GitResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, GitResponse{
		Success: true,
		Message: "推送成功",
	})
}

// HandleCreateBranch 处理创建分支请求
func (h *GitHandler) HandleCreateBranch(c *gin.Context) {
	var req GitBranchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, GitResponse{
			Success: false,
			Error:   "无效的请求格式",
		})
		return
	}

	// 验证请求参数
	if req.Project == "" {
		c.JSON(http.StatusBadRequest, GitResponse{
			Success: false,
			Error:   "项目名称不能为空",
		})
		return
	}

	if req.Branch == "" {
		c.JSON(http.StatusBadRequest, GitResponse{
			Success: false,
			Error:   "分支名称不能为空",
		})
		return
	}

	// 执行创建分支
	projectPath := filepath.Join(h.gitService.Workspace, "frontends", req.Project)
	err := h.gitService.CreateBranch(projectPath, req.Branch)
	if err != nil {
		c.JSON(http.StatusInternalServerError, GitResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, GitResponse{
		Success: true,
		Message: "分支创建成功",
	})
}

// HandleSwitchBranch 处理切换分支请求
func (h *GitHandler) HandleSwitchBranch(c *gin.Context) {
	var req GitBranchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, GitResponse{
			Success: false,
			Error:   "无效的请求格式",
		})
		return
	}

	// 验证请求参数
	if req.Project == "" {
		c.JSON(http.StatusBadRequest, GitResponse{
			Success: false,
			Error:   "项目名称不能为空",
		})
		return
	}

	if req.Branch == "" {
		c.JSON(http.StatusBadRequest, GitResponse{
			Success: false,
			Error:   "分支名称不能为空",
		})
		return
	}

	// 执行切换分支
	projectPath := filepath.Join(h.gitService.Workspace, "frontends", req.Project)
	err := h.gitService.SwitchBranch(projectPath, req.Branch)
	if err != nil {
		c.JSON(http.StatusInternalServerError, GitResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, GitResponse{
		Success: true,
		Message: "分支切换成功",
	})
}

// HandleGetBranches 获取分支列表
func (h *GitHandler) HandleGetBranches(c *gin.Context) {
	project := c.Param("project")
	if project == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "项目名称不能为空",
		})
		return
	}

	projectPath := filepath.Join(h.gitService.Workspace, "frontends", project)
	branches, err := h.gitService.GetBranches(projectPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"branches": branches,
	})
}

// HandleGetDiff 获取差异
func (h *GitHandler) HandleGetDiff(c *gin.Context) {
	project := c.Param("project")
	if project == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "项目名称不能为空",
		})
		return
	}

	projectPath := filepath.Join(h.gitService.Workspace, "frontends", project)
	diff, err := h.gitService.GetDiff(projectPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"diff":    diff,
	})
}

// HandleResetChanges 重置更改
func (h *GitHandler) HandleResetChanges(c *gin.Context) {
	project := c.Param("project")
	if project == "" {
		c.JSON(http.StatusBadRequest, GitResponse{
			Success: false,
			Error:   "项目名称不能为空",
		})
		return
	}

	projectPath := filepath.Join(h.gitService.Workspace, "frontends", project)
	err := h.gitService.ResetChanges(projectPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, GitResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, GitResponse{
		Success: true,
		Message: "更改已重置",
	})
}
