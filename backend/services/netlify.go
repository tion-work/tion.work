package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

// NetlifyService Netlify 部署服务
type NetlifyService struct {
	AuthToken string
	SiteID    string
	Workspace string
	Client    *http.Client
}

// NewNetlifyService 创建新的 Netlify 服务
func NewNetlifyService(authToken, siteID, workspace string) *NetlifyService {
	return &NetlifyService{
		AuthToken: authToken,
		SiteID:    siteID,
		Workspace: workspace,
		Client: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// DeployRequest 部署请求
type DeployRequest struct {
	Files map[string]string `json:"files"`
}

// DeployResponse 部署响应
type DeployResponse struct {
	ID       string `json:"id"`
	URL      string `json:"url"`
	State    string `json:"state"`
	Error    string `json:"error,omitempty"`
	DeployID string `json:"deploy_id"`
}

// DeployStatus 部署状态
type DeployStatus struct {
	ID     string `json:"id"`
	State  string `json:"state"`
	URL    string `json:"url"`
	Error  string `json:"error,omitempty"`
	Ready  bool   `json:"ready"`
	Failed bool   `json:"failed"`
}

// DeployProject 部署项目到 Netlify
func (s *NetlifyService) DeployProject(projectPath string) (*DeployResponse, error) {
	// 检查项目路径是否存在
	if _, err := os.Stat(projectPath); os.IsNotExist(err) {
		return nil, fmt.Errorf("项目路径不存在: %s", projectPath)
	}

	// 构建项目
	if err := s.buildProject(projectPath); err != nil {
		return nil, fmt.Errorf("构建项目失败: %v", err)
	}

	// 获取构建输出目录
	buildDir := s.getBuildDirectory(projectPath)
	if buildDir == "" {
		return nil, fmt.Errorf("无法找到构建输出目录")
	}

	// 创建部署
	return s.createDeploy(buildDir)
}

// buildProject 构建项目
func (s *NetlifyService) buildProject(projectPath string) error {
	// 检查 package.json 是否存在
	packageJsonPath := filepath.Join(projectPath, "package.json")
	if _, err := os.Stat(packageJsonPath); os.IsNotExist(err) {
		return fmt.Errorf("项目不是有效的 Node.js 项目（缺少 package.json）")
	}

	// 执行构建命令
	cmd := exec.Command("npm", "run", "build")
	cmd.Dir = projectPath

	output, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("构建失败: %v\n输出: %s", err, string(output))
	}

	return nil
}

// getBuildDirectory 获取构建输出目录
func (s *NetlifyService) getBuildDirectory(projectPath string) string {
	// 常见的构建输出目录
	possibleDirs := []string{
		filepath.Join(projectPath, "dist"),
		filepath.Join(projectPath, "build"),
		filepath.Join(projectPath, "out"),
		filepath.Join(projectPath, ".next"),
		filepath.Join(projectPath, "public"),
	}

	for _, dir := range possibleDirs {
		if _, err := os.Stat(dir); err == nil {
			return dir
		}
	}

	return ""
}

// createDeploy 创建部署
func (s *NetlifyService) createDeploy(buildDir string) (*DeployResponse, error) {
	// 读取构建目录中的所有文件
	files, err := s.readDirectoryFiles(buildDir)
	if err != nil {
		return nil, fmt.Errorf("读取构建文件失败: %v", err)
	}

	// 创建部署请求
	deployReq := DeployRequest{
		Files: files,
	}

	// 序列化请求
	reqBody, err := json.Marshal(deployReq)
	if err != nil {
		return nil, fmt.Errorf("序列化请求失败: %v", err)
	}

	// 创建 HTTP 请求
	url := fmt.Sprintf("https://api.netlify.com/api/v1/sites/%s/deploys", s.SiteID)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, fmt.Errorf("创建请求失败: %v", err)
	}

	// 设置请求头
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+s.AuthToken)

	// 发送请求
	resp, err := s.Client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("发送请求失败: %v", err)
	}
	defer resp.Body.Close()

	// 读取响应
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应失败: %v", err)
	}

	// 检查状态码
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("部署失败: %s (状态码: %d)", string(respBody), resp.StatusCode)
	}

	// 解析响应
	var deployResp DeployResponse
	if err := json.Unmarshal(respBody, &deployResp); err != nil {
		return nil, fmt.Errorf("解析响应失败: %v", err)
	}

	return &deployResp, nil
}

// readDirectoryFiles 读取目录中的所有文件
func (s *NetlifyService) readDirectoryFiles(dir string) (map[string]string, error) {
	files := make(map[string]string)

	err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// 跳过目录
		if info.IsDir() {
			return nil
		}

		// 读取文件内容
		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		// 计算相对路径
		relPath, err := filepath.Rel(dir, path)
		if err != nil {
			return err
		}

		// 将文件内容转换为 base64 编码
		files[relPath] = string(content)

		return nil
	})

	return files, err
}

// GetDeployStatus 获取部署状态
func (s *NetlifyService) GetDeployStatus(deployID string) (*DeployStatus, error) {
	// 创建 HTTP 请求
	url := fmt.Sprintf("https://api.netlify.com/api/v1/deploys/%s", deployID)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("创建请求失败: %v", err)
	}

	// 设置请求头
	req.Header.Set("Authorization", "Bearer "+s.AuthToken)

	// 发送请求
	resp, err := s.Client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("发送请求失败: %v", err)
	}
	defer resp.Body.Close()

	// 读取响应
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应失败: %v", err)
	}

	// 检查状态码
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("获取部署状态失败: %s (状态码: %d)", string(respBody), resp.StatusCode)
	}

	// 解析响应
	var status DeployStatus
	if err := json.Unmarshal(respBody, &status); err != nil {
		return nil, fmt.Errorf("解析响应失败: %v", err)
	}

	return &status, nil
}

// GetSiteInfo 获取站点信息
func (s *NetlifyService) GetSiteInfo() (map[string]interface{}, error) {
	// 创建 HTTP 请求
	url := fmt.Sprintf("https://api.netlify.com/api/v1/sites/%s", s.SiteID)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("创建请求失败: %v", err)
	}

	// 设置请求头
	req.Header.Set("Authorization", "Bearer "+s.AuthToken)

	// 发送请求
	resp, err := s.Client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("发送请求失败: %v", err)
	}
	defer resp.Body.Close()

	// 读取响应
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取响应失败: %v", err)
	}

	// 检查状态码
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("获取站点信息失败: %s (状态码: %d)", string(respBody), resp.StatusCode)
	}

	// 解析响应
	var siteInfo map[string]interface{}
	if err := json.Unmarshal(respBody, &siteInfo); err != nil {
		return nil, fmt.Errorf("解析响应失败: %v", err)
	}

	return siteInfo, nil
}

// DeployProjectFromPath 从路径部署项目
func (s *NetlifyService) DeployProjectFromPath(project string, workspace string) (*DeployResponse, error) {
	projectPath := filepath.Join(workspace, "frontends", project)
	return s.DeployProject(projectPath)
}
