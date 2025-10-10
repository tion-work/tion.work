'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            关于 dev.tion.work
          </h1>
          <p className="text-lg text-gray-600">
            现代化开发者工具集合平台
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mission */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🎯 我们的使命
            </h2>
            <p className="text-gray-600 leading-relaxed">
              为开发者提供一站式解决方案，让复杂的开发任务变得简单高效。
              我们致力于打造最实用的开发者工具集合，帮助开发者提升工作效率，
              专注于创造价值而非重复造轮子。
            </p>
          </Card>

          {/* Features */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ✨ 核心特性
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                零注册使用，即开即用
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                实时处理，快速响应
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                响应式设计，多端适配
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                开源免费，持续更新
              </li>
            </ul>
          </Card>

          {/* Tools Overview */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🛠️ 工具分类
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  代码处理
                </h3>
                <p className="text-sm text-blue-700">
                  JSON 格式化、JavaScript 格式化、CSS 压缩、HTML 压缩等
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">
                  数据处理
                </h3>
                <p className="text-sm text-green-700">
                  Base64 编解码、URL 编解码、时间戳转换、哈希生成等
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">
                  安全工具
                </h3>
                <p className="text-sm text-purple-700">
                  密码生成器、JWT 解码器、正则表达式测试等
                </p>
              </div>
            </div>
          </Card>

          {/* Technology Stack */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🚀 技术栈
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">前端框架</span>
                <span className="text-gray-900 font-medium">Next.js 14</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">样式框架</span>
                <span className="text-gray-900 font-medium">Tailwind CSS</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">状态管理</span>
                <span className="text-gray-900 font-medium">Zustand</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">后端服务</span>
                <span className="text-gray-900 font-medium">Node.js + Fastify</span>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📞 联系我们
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                如果您有任何建议或问题，欢迎随时联系我们。
              </p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">
                  Twitter
                </Button>
                <Button variant="outline" size="sm">
                  Email
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            © 2024 dev.tion.work - 让开发更简单
          </p>
        </div>
      </div>
    </div>
  );
}