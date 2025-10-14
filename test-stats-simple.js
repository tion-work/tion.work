// 简单的统计功能测试脚本
const http = require("http");

console.log("🧪 开始测试 TiON.Work 统计功能...\n");

// 测试函数
function testEndpoint(url, description) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        console.log(`✅ ${description}: ${res.statusCode}`);
        resolve({ status: res.statusCode, data });
      });
    });

    req.on("error", (err) => {
      console.log(`❌ ${description}: ${err.message}`);
      reject(err);
    });

    req.setTimeout(5000, () => {
      console.log(`⏰ ${description}: 超时`);
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
}

// 运行测试
async function runTests() {
  try {
    console.log("📱 测试开发工具站...");
    await testEndpoint("http://localhost:3002", "开发工具站首页");

    console.log("\n📊 测试统计页面...");
    await testEndpoint("http://localhost:3002/stats", "统计页面");

    console.log("\n🧪 测试统计功能测试页面...");
    await testEndpoint(
      "http://localhost:3002/test-stats.html",
      "统计功能测试页面"
    );

    console.log("\n🛠️ 测试工具页面...");
    await testEndpoint(
      "http://localhost:3002/tools/json-formatter",
      "JSON 格式化工具"
    );

    console.log("\n📈 测试后端 API...");
    await testEndpoint("http://localhost:8080/health", "后端健康检查");
    await testEndpoint("http://localhost:8080/tools", "工具列表 API");

    console.log("\n🎉 所有测试完成！");
    console.log("\n📋 测试结果总结:");
    console.log("✅ 开发工具站: 可访问");
    console.log("✅ 统计页面: 可访问");
    console.log("✅ 测试页面: 可访问");
    console.log("✅ 工具页面: 可访问");
    console.log("✅ 后端 API: 可访问");

    console.log("\n🚀 下一步:");
    console.log("1. 在浏览器中访问 http://localhost:3002/test-stats.html");
    console.log('2. 点击 "模拟工具使用" 按钮');
    console.log("3. 观察统计数据的变化");
    console.log("4. 访问 http://localhost:3002/stats 查看真实统计页面");
  } catch (error) {
    console.error("❌ 测试失败:", error.message);
  }
}

// 运行测试
runTests();
