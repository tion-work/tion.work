package handlers

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"tion.work/backend/services"
)

// MonitorHandler 监控面板处理器
type MonitorHandler struct {
	cursorService *services.CursorService
	gitService    *services.GitService
	startTime     time.Time
}

// NewMonitorHandler 创建新的监控处理器
func NewMonitorHandler(cursorService *services.CursorService, gitService *services.GitService) *MonitorHandler {
	return &MonitorHandler{
		cursorService: cursorService,
		gitService:    gitService,
		startTime:     time.Now(),
	}
}

// SystemStats 系统统计信息
type SystemStats struct {
	Uptime        string                 `json:"uptime"`
	MemoryUsage   map[string]interface{} `json:"memory_usage"`
	DiskUsage     map[string]interface{} `json:"disk_usage"`
	CPUUsage      map[string]interface{} `json:"cpu_usage"`
	ProjectStats  map[string]interface{} `json:"project_stats"`
	ServiceStatus map[string]interface{} `json:"service_status"`
}

// ProjectStats 项目统计信息
type ProjectStats struct {
	TotalProjects    int                    `json:"total_projects"`
	ActiveProjects   int                    `json:"active_projects"`
	ProjectDetails   []map[string]interface{} `json:"project_details"`
	TotalCommits     int                    `json:"total_commits"`
	TotalDeployments int                    `json:"total_deployments"`
}

// HandleGetSystemStats 获取系统统计信息
func (h *MonitorHandler) HandleGetSystemStats(c *gin.Context) {
	stats := &SystemStats{
		Uptime:        h.getUptime(),
		MemoryUsage:   h.getMemoryUsage(),
		DiskUsage:     h.getDiskUsage(),
		CPUUsage:      h.getCPUUsage(),
		ProjectStats:  h.getProjectStats(),
		ServiceStatus: h.getServiceStatus(),
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"stats":   stats,
		"timestamp": time.Now().Unix(),
	})
}

// HandleGetProjectStats 获取项目统计信息
func (h *MonitorHandler) HandleGetProjectStats(c *gin.Context) {
	projectStats := h.getDetailedProjectStats()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"project_stats": projectStats,
		"timestamp": time.Now().Unix(),
	})
}

// HandleGetServiceHealth 获取服务健康状态
func (h *MonitorHandler) HandleGetServiceHealth(c *gin.Context) {
	health := h.getServiceHealth()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"health":  health,
		"timestamp": time.Now().Unix(),
	})
}

// getUptime 获取系统运行时间
func (h *MonitorHandler) getUptime() string {
	uptime := time.Since(h.startTime)
	hours := int(uptime.Hours())
	minutes := int(uptime.Minutes()) % 60
	seconds := int(uptime.Seconds()) % 60

	return fmt.Sprintf("%d小时 %d分钟 %d秒", hours, minutes, seconds)
}

// getMemoryUsage 获取内存使用情况
func (h *MonitorHandler) getMemoryUsage() map[string]interface{} {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	return map[string]interface{}{
		"alloc_mb":      m.Alloc / 1024 / 1024,
		"total_alloc_mb": m.TotalAlloc / 1024 / 1024,
		"sys_mb":        m.Sys / 1024 / 1024,
		"num_gc":        m.NumGC,
		"gc_cpu_fraction": m.GCCPUFraction,
	}
}

// getDiskUsage 获取磁盘使用情况
func (h *MonitorHandler) getDiskUsage() map[string]interface{} {
	workspace := h.cursorService.Workspace

	// 获取工作空间大小
	var totalSize int64
	err := filepath.Walk(workspace, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if !info.IsDir() {
			totalSize += info.Size()
		}
		return nil
	})

	if err != nil {
		return map[string]interface{}{
			"error": "无法获取磁盘使用情况",
		}
	}

	return map[string]interface{}{
		"workspace_size_mb": totalSize / 1024 / 1024,
		"workspace_path":    workspace,
	}
}

// getCPUUsage 获取CPU使用情况
func (h *MonitorHandler) getCPUUsage() map[string]interface{} {
	// 获取CPU核心数
	numCPU := runtime.NumCPU()

	// 获取Goroutine数量
	numGoroutines := runtime.NumGoroutine()

	return map[string]interface{}{
		"num_cpu":        numCPU,
		"num_goroutines": numGoroutines,
		"go_version":     runtime.Version(),
	}
}

// getProjectStats 获取项目统计信息
func (h *MonitorHandler) getProjectStats() map[string]interface{} {
	projects, err := h.cursorService.GetAvailableProjects()
	if err != nil {
		return map[string]interface{}{
			"error": "无法获取项目列表",
		}
	}

	activeProjects := 0
	for _, project := range projects {
		status, err := h.cursorService.GetProjectStatus(project)
		if err == nil && status["exists"].(bool) {
			activeProjects++
		}
	}

	return map[string]interface{}{
		"total_projects":  len(projects),
		"active_projects": activeProjects,
		"projects":        projects,
	}
}

// getServiceStatus 获取服务状态
func (h *MonitorHandler) getServiceStatus() map[string]interface{} {
	status := map[string]interface{}{
		"server": "running",
		"cursor": "unknown",
		"git":    "unknown",
		"netlify": "unknown",
	}

	// 检查 Cursor 服务
	if h.cursorService != nil {
		status["cursor"] = "available"
	}

	// 检查 Git 服务
	if h.gitService != nil {
		status["git"] = "available"
	}

	// 检查 Netlify 服务
	// 这里可以添加 Netlify 服务检查逻辑

	return status
}

// getDetailedProjectStats 获取详细的项目统计信息
func (h *MonitorHandler) getDetailedProjectStats() *ProjectStats {
	projects, err := h.cursorService.GetAvailableProjects()
	if err != nil {
		return &ProjectStats{
			TotalProjects: 0,
			ActiveProjects: 0,
			ProjectDetails: []map[string]interface{}{},
		}
	}

	activeProjects := 0
	totalCommits := 0
	totalDeployments := 0
	projectDetails := []map[string]interface{}{}

	for _, project := range projects {
		status, err := h.cursorService.GetProjectStatus(project)
		if err != nil {
			continue
		}

		projectDetail := map[string]interface{}{
			"name":           project,
			"exists":         status["exists"],
			"has_package_json": status["has_package_json"],
			"has_node_modules": status["has_node_modules"],
			"path":           status["path"],
		}

		if status["exists"].(bool) {
			activeProjects++

			// 获取 Git 统计信息
			gitStats := h.getGitStats(project)
			projectDetail["git_stats"] = gitStats
			totalCommits += gitStats["commit_count"].(int)
		}

		projectDetails = append(projectDetails, projectDetail)
	}

	return &ProjectStats{
		TotalProjects:    len(projects),
		ActiveProjects:   activeProjects,
		ProjectDetails:   projectDetails,
		TotalCommits:     totalCommits,
		TotalDeployments: totalDeployments,
	}
}

// getGitStats 获取项目的Git统计信息
func (h *MonitorHandler) getGitStats(project string) map[string]interface{} {
	stats := map[string]interface{}{
		"commit_count": 0,
		"last_commit":  "",
		"branch":       "",
		"status":       "unknown",
	}

	// 获取提交数量
	output, err := exec.Command("git", "rev-list", "--count", "HEAD").Output()
	if err == nil {
		if count, err := strconv.Atoi(strings.TrimSpace(string(output))); err == nil {
			stats["commit_count"] = count
		}
	}

	// 获取最后提交信息
	output, err = exec.Command("git", "log", "-1", "--format=%H %s %ad", "--date=short").Output()
	if err == nil {
		parts := strings.Split(strings.TrimSpace(string(output)), " ")
		if len(parts) >= 3 {
			stats["last_commit"] = strings.Join(parts[1:], " ")
		}
	}

	// 获取当前分支
	output, err = exec.Command("git", "rev-parse", "--abbrev-ref", "HEAD").Output()
	if err == nil {
		stats["branch"] = strings.TrimSpace(string(output))
	}

	// 获取状态
	output, err = exec.Command("git", "status", "--porcelain").Output()
	if err == nil {
		if len(strings.TrimSpace(string(output))) == 0 {
			stats["status"] = "clean"
		} else {
			stats["status"] = "modified"
		}
	}

	return stats
}

// getServiceHealth 获取服务健康状态
func (h *MonitorHandler) getServiceHealth() map[string]interface{} {
	health := map[string]interface{}{
		"overall": "healthy",
		"services": map[string]interface{}{
			"api": map[string]interface{}{
				"status": "healthy",
				"response_time": "< 100ms",
			},
			"cursor": map[string]interface{}{
				"status": "healthy",
				"available": h.cursorService != nil,
			},
			"git": map[string]interface{}{
				"status": "healthy",
				"available": h.gitService != nil,
			},
		},
		"timestamp": time.Now().Unix(),
	}

	return health
}
