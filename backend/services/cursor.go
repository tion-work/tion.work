package services

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"sync"
)

// CursorService Cursor Agent 服务
type CursorService struct {
	APIKey    string
	Workspace string
}

// NewCursorService 创建新的 Cursor 服务
func NewCursorService(apiKey, workspace string) *CursorService {
	return &CursorService{
		APIKey:    apiKey,
		Workspace: workspace,
	}
}

// ExecuteCommand 执行 Cursor Agent 命令
func (s *CursorService) ExecuteCommand(project, prompt string, handler func(string)) error {
	// 构建项目路径
	projectPath := filepath.Join(s.Workspace, "frontends", project)

	// 检查项目是否存在
	if _, err := os.Stat(projectPath); os.IsNotExist(err) {
		return fmt.Errorf("项目 %s 不存在于路径 %s", project, projectPath)
	}

	// 构建 Cursor Agent 命令
	cmd := exec.Command("cursor-agent",
		"--api-key", s.APIKey,
		"--project", projectPath,
		"--plan", prompt,
	)

	// 设置工作目录
	cmd.Dir = projectPath

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

	// 处理标准输出
	go func() {
		defer wg.Done()
		scanner := bufio.NewScanner(stdout)
		for scanner.Scan() {
			line := scanner.Text()
			handler(fmt.Sprintf("[INFO] %s", line))
		}
	}()

	// 处理标准错误
	go func() {
		defer wg.Done()
		scanner := bufio.NewScanner(stderr)
		for scanner.Scan() {
			line := scanner.Text()
			handler(fmt.Sprintf("[ERROR] %s", line))
		}
	}()

	// 等待命令完成
	wg.Wait()

	if err := cmd.Wait(); err != nil {
		return fmt.Errorf("命令执行失败: %v", err)
	}

	return nil
}

// ExecuteCommandStream 执行命令并流式返回结果
func (s *CursorService) ExecuteCommandStream(project, prompt string, handler func(string)) error {
	// 构建项目路径
	projectPath := filepath.Join(s.Workspace, "frontends", project)

	// 检查项目是否存在
	if _, err := os.Stat(projectPath); os.IsNotExist(err) {
		return fmt.Errorf("项目 %s 不存在于路径 %s", project, projectPath)
	}

	// 构建 Cursor Agent 命令
	cmd := exec.Command("cursor-agent",
		"--api-key", s.APIKey,
		"--project", projectPath,
		"--plan", prompt,
	)

	// 设置工作目录
	cmd.Dir = projectPath

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

	// 处理标准输出
	go func() {
		defer wg.Done()
		scanner := bufio.NewScanner(stdout)
		for scanner.Scan() {
			line := scanner.Text()
			handler(fmt.Sprintf("[INFO] %s", line))
		}
	}()

	// 处理标准错误
	go func() {
		defer wg.Done()
		scanner := bufio.NewScanner(stderr)
		for scanner.Scan() {
			line := scanner.Text()
			handler(fmt.Sprintf("[ERROR] %s", line))
		}
	}()

	// 等待命令完成
	wg.Wait()

	if err := cmd.Wait(); err != nil {
		return fmt.Errorf("命令执行失败: %v", err)
	}

	return nil
}

// GetProjectStatus 获取项目状态
func (s *CursorService) GetProjectStatus(project string) (map[string]interface{}, error) {
	projectPath := filepath.Join(s.Workspace, "frontends", project)

	// 检查项目是否存在
	if _, err := os.Stat(projectPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("项目 %s 不存在", project)
	}

	// 获取项目信息
	status := make(map[string]interface{})
	status["project"] = project
	status["path"] = projectPath
	status["exists"] = true

	// 检查 package.json 是否存在
	packageJsonPath := filepath.Join(projectPath, "package.json")
	if _, err := os.Stat(packageJsonPath); err == nil {
		status["hasPackageJson"] = true
	} else {
		status["hasPackageJson"] = false
	}

	// 检查是否有 node_modules
	nodeModulesPath := filepath.Join(projectPath, "node_modules")
	if _, err := os.Stat(nodeModulesPath); err == nil {
		status["hasNodeModules"] = true
	} else {
		status["hasNodeModules"] = false
	}

	return status, nil
}

// ValidateProject 验证项目是否有效
func (s *CursorService) ValidateProject(project string) error {
	projectPath := filepath.Join(s.Workspace, "frontends", project)

	// 检查项目目录是否存在
	if _, err := os.Stat(projectPath); os.IsNotExist(err) {
		return fmt.Errorf("项目 %s 不存在于路径 %s", project, projectPath)
	}

	// 检查是否是有效的项目目录
	packageJsonPath := filepath.Join(projectPath, "package.json")
	if _, err := os.Stat(packageJsonPath); os.IsNotExist(err) {
		return fmt.Errorf("项目 %s 不是有效的 Node.js 项目（缺少 package.json）", project)
	}

	return nil
}

// GetAvailableProjects 获取可用项目列表
func (s *CursorService) GetAvailableProjects() ([]string, error) {
	frontendsPath := filepath.Join(s.Workspace, "frontends")

	// 检查 frontends 目录是否存在
	if _, err := os.Stat(frontendsPath); os.IsNotExist(err) {
		return []string{}, fmt.Errorf("frontends 目录不存在: %s", frontendsPath)
	}

	// 读取目录内容
	entries, err := os.ReadDir(frontendsPath)
	if err != nil {
		return []string{}, fmt.Errorf("读取 frontends 目录失败: %v", err)
	}

	var projects []string
	for _, entry := range entries {
		if entry.IsDir() {
			// 检查是否是有效的项目目录
			projectPath := filepath.Join(frontendsPath, entry.Name())
			packageJsonPath := filepath.Join(projectPath, "package.json")

			if _, err := os.Stat(packageJsonPath); err == nil {
				projects = append(projects, entry.Name())
			}
		}
	}

	return projects, nil
}

// InstallDependencies 安装项目依赖
func (s *CursorService) InstallDependencies(project string) error {
	projectPath := filepath.Join(s.Workspace, "frontends", project)

	// 检查项目是否存在
	if err := s.ValidateProject(project); err != nil {
		return err
	}

	// 执行 npm install
	cmd := exec.Command("npm", "install", "--legacy-peer-deps")
	cmd.Dir = projectPath

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("安装依赖失败: %v\n输出: %s", err, string(output))
	}

	return nil
}

// BuildProject 构建项目
func (s *CursorService) BuildProject(project string) error {
	projectPath := filepath.Join(s.Workspace, "frontends", project)

	// 检查项目是否存在
	if err := s.ValidateProject(project); err != nil {
		return err
	}

	// 执行 npm run build
	cmd := exec.Command("npm", "run", "build")
	cmd.Dir = projectPath

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("构建项目失败: %v\n输出: %s", err, string(output))
	}

	return nil
}
