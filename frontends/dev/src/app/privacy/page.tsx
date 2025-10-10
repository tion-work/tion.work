'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            隐私政策
          </h1>
          <p className="text-lg text-gray-600">
            我们重视您的隐私，本政策说明了我们如何收集、使用和保护您的信息
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 信息收集 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📊 信息收集
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                我们承诺最小化数据收集原则。在使用我们的工具时，我们可能会收集以下信息：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>工具使用统计（匿名化处理）</li>
                <li>错误日志（用于改进服务）</li>
                <li>浏览器类型和版本（用于兼容性优化）</li>
                <li>IP地址（用于安全防护，不用于个人识别）</li>
              </ul>
              <p className="font-medium text-gray-800">
                我们不会收集您的个人身份信息，如姓名、邮箱、电话号码等。
              </p>
            </div>
          </Card>

          {/* 信息使用 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🔧 信息使用
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>我们收集的信息仅用于以下目的：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>改进工具功能和性能</li>
                <li>分析使用模式以优化用户体验</li>
                <li>检测和防止滥用行为</li>
                <li>提供技术支持和故障排除</li>
              </ul>
            </div>
          </Card>

          {/* 数据安全 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🔒 数据安全
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>我们采取以下措施保护您的数据：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>使用HTTPS加密传输所有数据</li>
                <li>定期更新安全补丁和系统</li>
                <li>限制数据访问权限</li>
                <li>定期备份和监控系统</li>
              </ul>
            </div>
          </Card>

          {/* 第三方服务 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🌐 第三方服务
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>我们可能使用以下第三方服务：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Google Analytics（用于网站分析）</li>
                <li>CDN服务（用于内容分发）</li>
                <li>云服务提供商（用于数据存储）</li>
              </ul>
              <p>
                这些第三方服务有自己的隐私政策，我们建议您查看相关条款。
              </p>
            </div>
          </Card>

          {/* 数据保留 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ⏰ 数据保留
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>我们保留数据的时间：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>使用统计：最多保留12个月</li>
                <li>错误日志：最多保留6个月</li>
                <li>安全日志：最多保留24个月</li>
              </ul>
              <p>
                超过保留期限的数据将被自动删除。
              </p>
            </div>
          </Card>

          {/* 您的权利 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ⚖️ 您的权利
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>您拥有以下权利：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>了解我们收集了哪些关于您的信息</li>
                <li>要求我们删除您的数据</li>
                <li>要求我们更正不准确的信息</li>
                <li>限制我们处理您的数据</li>
                <li>数据可携带权</li>
              </ul>
            </div>
          </Card>

          {/* 联系我们 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📞 联系我们
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
              </p>
              <div className="space-y-2">
                <p>邮箱：privacy@dev.tion.work</p>
              </div>
            </div>
          </Card>

          {/* 政策更新 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📝 政策更新
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                我们可能会不时更新本隐私政策。重大变更将通过网站公告的方式通知您。
                建议您定期查看本页面以了解最新信息。
              </p>
              <p className="text-sm text-gray-500">
                最后更新：2025年10月1日
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
