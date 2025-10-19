package services

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// GitService Git 操作服务
type GitService struct {
	Workspace string
	Token     string
}

// NewGitService 创建新的 Git 服务
func NewGitService(workspace, token string) *GitService {
	return &GitService{
		Workspace: workspace,
		Token:     token,
	}
}

// CloneRepository 克隆仓库
func (s *GitService) CloneRepository(repoURL, targetPath string) error {
	// 检查目标路径是否存在
	if _, err := os.Stat(targetPath); !os.IsNotExist(err) {
		return fmt.Errorf("目标路径已存在: %s", targetPath)
	}

	// 构建克隆命令
	cmd := exec.Command("git", "clone", repoURL, targetPath)

	// 设置环境变量（如果需要认证）
	if s.Token != "" {
		cmd.Env = append(os.Environ(), fmt.Sprintf("GITHUB_TOKEN=%s", s.Token))
	}

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("克隆仓库失败: %v\n输出: %s", err, string(output))
	}

	return nil
}

// PullRepository 拉取最新代码
func (s *GitService) PullRepository(repoPath string) error {
	// 检查仓库路径是否存在
	if _, err := os.Stat(repoPath); os.IsNotExist(err) {
		return fmt.Errorf("仓库路径不存在: %s", repoPath)
	}

	// 切换到仓库目录
	cmd := exec.Command("git", "pull", "origin", "main")
	cmd.Dir = repoPath

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("拉取代码失败: %v\n输出: %s", err, string(output))
	}

	return nil
}

// GetStatus 获取 Git 状态
func (s *GitService) GetStatus(repoPath string) (map[string]interface{}, error) {
	// 检查仓库路径是否存在
	if _, err := os.Stat(repoPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("仓库路径不存在: %s", repoPath)
	}

	status := make(map[string]interface{})

	// 获取当前分支
	cmd := exec.Command("git", "branch", "--show-current")
	cmd.Dir = repoPath
	output, err := cmd.Output()
	if err == nil {
		status["currentBranch"] = strings.TrimSpace(string(output))
	}

	// 获取状态
	cmd = exec.Command("git", "status", "--porcelain")
	cmd.Dir = repoPath
	output, err = cmd.Output()
	if err == nil {
		lines := strings.Split(strings.TrimSpace(string(output)), "\n")
		status["modifiedFiles"] = lines
		status["hasChanges"] = len(lines) > 0 && lines[0] != ""
	}

	// 获取提交历史
	cmd = exec.Command("git", "log", "--oneline", "-5")
	cmd.Dir = repoPath
	output, err = cmd.Output()
	if err == nil {
		commits := strings.Split(strings.TrimSpace(string(output)), "\n")
		status["recentCommits"] = commits
	}

	return status, nil
}

// AddFiles 添加文件到暂存区
func (s *GitService) AddFiles(repoPath string, files ...string) error {
	// 检查仓库路径是否存在
	if _, err := os.Stat(repoPath); os.IsNotExist(err) {
		return fmt.Errorf("仓库路径不存在: %s", repoPath)
	}

	// 构建添加命令
	args := append([]string{"add"}, files...)
	cmd := exec.Command("git", args...)
	cmd.Dir = repoPath

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("添加文件失败: %v\n输出: %s", err, string(output))
	}

	return nil
}

// Commit 提交更改
func (s *GitService) Commit(repoPath, message string) error {
	// 检查仓库路径是否存在
	if _, err := os.Stat(repoPath); os.IsNotExist(err) {
		return fmt.Errorf("仓库路径不存在: %s", repoPath)
	}

	// 提交更改
	cmd := exec.Command("git", "commit", "-m", message)
	cmd.Dir = repoPath

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("提交失败: %v\n输出: %s", err, string(output))
	}

	return nil
}

// Push 推送到远程仓库
func (s *GitService) Push(repoPath, branch string) error {
	// 检查仓库路径是否存在
	if _, err := os.Stat(repoPath); os.IsNotExist(err) {
		return fmt.Errorf("仓库路径不存在: %s", repoPath)
	}

	// 推送到远程仓库
	cmd := exec.Command("git", "push", "origin", branch)
	cmd.Dir = repoPath

	// 设置环境变量（如果需要认证）
	if s.Token != "" {
		cmd.Env = append(os.Environ(), fmt.Sprintf("GITHUB_TOKEN=%s", s.Token))
	}

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("推送失败: %v\n输出: %s", err, string(output))
	}

	return nil
}

// CreateBranch 创建新分支
func (s *GitService) CreateBranch(repoPath, branchName string) error {
	// 检查仓库路径是否存在
	if _, err := os.Stat(repoPath); os.IsNotExist(err) {
		return fmt.Errorf("仓库路径不存在: %s", repoPath)
	}

	// 创建并切换到新分支
	cmd := exec.Command("git", "checkout", "-b", branchName)
	cmd.Dir = repoPath

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("创建分支失败: %v\n输出: %s", err, string(output))
	}

	return nil
}

// SwitchBranch 切换分支
func (s *GitService) SwitchBranch(repoPath, branchName string) error {
	// 检查仓库路径是否存在
	if _, err := os.Stat(repoPath); os.IsNotExist(err) {
		return fmt.Errorf("仓库路径不存在: %s", repoPath)
	}

	// 切换分支
	cmd := exec.Command("git", "checkout", branchName)
	cmd.Dir = repoPath

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("切换分支失败: %v\n输出: %s", err, string(output))
	}

	return nil
}

// GetBranches 获取所有分支
func (s *GitService) GetBranches(repoPath string) ([]string, error) {
	// 检查仓库路径是否存在
	if _, err := os.Stat(repoPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("仓库路径不存在: %s", repoPath)
	}

	// 获取本地分支
	cmd := exec.Command("git", "branch")
	cmd.Dir = repoPath
	output, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("获取分支失败: %v", err)
	}

	lines := strings.Split(strings.TrimSpace(string(output)), "\n")
	var branches []string
	for _, line := range lines {
		branch := strings.TrimSpace(strings.TrimPrefix(line, "*"))
		if branch != "" {
			branches = append(branches, branch)
		}
	}

	return branches, nil
}

// GetDiff 获取差异
func (s *GitService) GetDiff(repoPath string) (string, error) {
	// 检查仓库路径是否存在
	if _, err := os.Stat(repoPath); os.IsNotExist(err) {
		return "", fmt.Errorf("仓库路径不存在: %s", repoPath)
	}

	// 获取差异
	cmd := exec.Command("git", "diff")
	cmd.Dir = repoPath
	output, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("获取差异失败: %v", err)
	}

	return string(output), nil
}

// GetStagedDiff 获取暂存区差异
func (s *GitService) GetStagedDiff(repoPath string) (string, error) {
	// 检查仓库路径是否存在
	if _, err := os.Stat(repoPath); os.IsNotExist(err) {
		return "", fmt.Errorf("仓库路径不存在: %s", repoPath)
	}

	// 获取暂存区差异
	cmd := exec.Command("git", "diff", "--cached")
	cmd.Dir = repoPath
	output, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("获取暂存区差异失败: %v", err)
	}

	return string(output), nil
}

// ResetChanges 重置更改
func (s *GitService) ResetChanges(repoPath string) error {
	// 检查仓库路径是否存在
	if _, err := os.Stat(repoPath); os.IsNotExist(err) {
		return fmt.Errorf("仓库路径不存在: %s", repoPath)
	}

	// 重置所有更改
	cmd := exec.Command("git", "reset", "--hard", "HEAD")
	cmd.Dir = repoPath

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("重置更改失败: %v\n输出: %s", err, string(output))
	}

	return nil
}

// GetProjectGitStatus 获取项目 Git 状态
func (s *GitService) GetProjectGitStatus(project string) (map[string]interface{}, error) {
	projectPath := filepath.Join(s.Workspace, "frontends", project)
	return s.GetStatus(projectPath)
}

// CommitProject 提交项目更改
func (s *GitService) CommitProject(project, message string) error {
	projectPath := filepath.Join(s.Workspace, "frontends", project)

	// 添加所有更改
	if err := s.AddFiles(projectPath, "."); err != nil {
		return fmt.Errorf("添加文件失败: %v", err)
	}

	// 提交更改
	if err := s.Commit(projectPath, message); err != nil {
		return fmt.Errorf("提交失败: %v", err)
	}

	return nil
}

// PushProject 推送项目更改
func (s *GitService) PushProject(project, branch string) error {
	projectPath := filepath.Join(s.Workspace, "frontends", project)
	return s.Push(projectPath, branch)
}
