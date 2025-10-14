// 测试统计功能的模拟脚本
const puppeteer = require("puppeteer");

async function testStatsFunctionality() {
  console.log("🚀 开始测试 TiON.Work 统计功能...");

  const browser = await puppeteer.launch({
    headless: false, // 显示浏览器窗口
    defaultViewport: { width: 1280, height: 800 },
  });

  try {
    const page = await browser.newPage();

    // 1. 访问开发工具站
    console.log("📱 访问开发工具站...");
    await page.goto("http://localhost:3002", { waitUntil: "networkidle0" });

    // 等待页面加载完成
    await page.waitForTimeout(3000);

    // 2. 检查统计页面
    console.log("📊 访问统计页面...");
    await page.goto("http://localhost:3002/stats", {
      waitUntil: "networkidle0",
    });
    await page.waitForTimeout(2000);

    // 截图保存统计页面
    await page.screenshot({ path: "stats-page-initial.png", fullPage: true });
    console.log("📸 已保存统计页面截图: stats-page-initial.png");

    // 3. 访问工具页面并模拟使用
    console.log("🛠️ 测试工具使用...");

    // 尝试访问 JSON 格式化工具
    await page.goto("http://localhost:3002/tools/json-formatter", {
      waitUntil: "networkidle0",
    });
    await page.waitForTimeout(2000);

    // 截图保存工具页面
    await page.screenshot({ path: "json-formatter-tool.png", fullPage: true });
    console.log("📸 已保存工具页面截图: json-formatter-tool.png");

    // 4. 模拟输入和处理
    console.log("⚙️ 模拟工具使用...");

    // 查找输入框
    const inputSelector =
      'textarea, input[type="text"], [contenteditable="true"]';
    const inputElement = await page.$(inputSelector);

    if (inputElement) {
      // 输入测试数据
      await inputElement.type('{"name": "test", "value": 123}');
      console.log("✅ 已输入测试数据");

      // 查找处理按钮
      const processButton = await page.$(
        'button:has-text("处理"), button:has-text("Process"), button[type="submit"]'
      );
      if (processButton) {
        await processButton.click();
        console.log("✅ 已点击处理按钮");

        // 等待处理完成
        await page.waitForTimeout(3000);

        // 截图保存处理结果
        await page.screenshot({
          path: "tool-processing-result.png",
          fullPage: true,
        });
        console.log("📸 已保存处理结果截图: tool-processing-result.png");
      }
    }

    // 5. 再次访问统计页面查看数据变化
    console.log("📈 检查统计数据变化...");
    await page.goto("http://localhost:3002/stats", {
      waitUntil: "networkidle0",
    });
    await page.waitForTimeout(2000);

    // 截图保存更新后的统计页面
    await page.screenshot({ path: "stats-page-updated.png", fullPage: true });
    console.log("📸 已保存更新后的统计页面截图: stats-page-updated.png");

    // 6. 检查 localStorage 中的数据
    console.log("💾 检查本地存储数据...");
    const statsData = await page.evaluate(() => {
      return localStorage.getItem("tion-work-stats");
    });

    if (statsData) {
      const parsedData = JSON.parse(statsData);
      console.log("📊 统计数据:", {
        总使用次数: parsedData.length,
        最近使用: parsedData.slice(-3).map((item) => ({
          工具: item.toolId,
          成功: item.success,
          处理时间: item.processingTime + "s",
          时间: new Date(item.timestamp).toLocaleString(),
        })),
      });
    } else {
      console.log("❌ 未找到统计数据");
    }

    console.log("✅ 测试完成！");
  } catch (error) {
    console.error("❌ 测试过程中出现错误:", error);
  } finally {
    await browser.close();
  }
}

// 检查是否安装了 puppeteer
try {
  require("puppeteer");
  testStatsFunctionality();
} catch (error) {
  console.log("📦 需要安装 puppeteer 来运行自动化测试");
  console.log("运行: npm install -g puppeteer");
  console.log("");
  console.log("或者手动测试:");
  console.log("1. 访问 http://localhost:3002");
  console.log("2. 使用任意工具");
  console.log("3. 访问 http://localhost:3002/stats 查看统计");
}
