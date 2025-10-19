// Demo 项目主入口文件
// 这是一个简单的演示项目，用于 AI 开发助手的各种功能测试

console.log('🚀 Demo 项目已启动！');
console.log('📝 这是一个用于 AI 开发助手功能测试的演示项目');
console.log('💬 您可以在这里自由聊天、测试功能、生成代码等');

// 示例函数：问候用户
function greetUser(name = '开发者') {
  return `你好，${name}！欢迎使用 AI 开发助手演示项目。`;
}

// 示例函数：生成随机 ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// 示例函数：格式化日期
function formatDate(date = new Date()) {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// 示例类：简单的数据管理器
class DataManager {
  constructor() {
    this.data = new Map();
  }

  set(key, value) {
    this.data.set(key, {
      value,
      timestamp: Date.now(),
      id: generateId()
    });
  }

  get(key) {
    const item = this.data.get(key);
    return item ? item.value : null;
  }

  getAll() {
    return Array.from(this.data.entries()).map(([key, item]) => ({
      key,
      value: item.value,
      timestamp: item.timestamp,
      id: item.id
    }));
  }

  clear() {
    this.data.clear();
  }
}

// 导出函数和类
module.exports = {
  greetUser,
  generateId,
  formatDate,
  DataManager
};

// 如果直接运行此文件，显示欢迎信息
if (require.main === module) {
  console.log('\n' + '='.repeat(50));
  console.log('🎯 AI 开发助手演示项目');
  console.log('='.repeat(50));
  console.log(greetUser());
  console.log(`⏰ 当前时间: ${formatDate()}`);
  console.log(`🆔 会话 ID: ${generateId()}`);
  console.log('='.repeat(50));
  console.log('\n💡 提示: 您可以在 AI 聊天界面中与这个项目进行交互');
  console.log('🔧 尝试询问: "帮我创建一个 React 组件" 或 "分析这段代码"');
  console.log('\n');
}
