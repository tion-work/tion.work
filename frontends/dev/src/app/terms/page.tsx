'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            服务条款
          </h1>
          <p className="text-lg text-gray-600">
            使用我们的服务即表示您同意遵守以下条款和条件
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 服务描述 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📋 服务描述
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                dev.tion.work 是一个免费的在线开发者工具集合平台，提供各种实用的开发工具，
                包括但不限于代码格式化、数据处理、安全工具等。
              </p>
              <p>
                我们的服务旨在帮助开发者提高工作效率，所有工具均可免费使用，无需注册。
              </p>
            </div>
          </Card>

          {/* 使用条款 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ✅ 使用条款
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>使用我们的服务时，您同意：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>仅将服务用于合法目的</li>
                <li>不滥用或恶意使用我们的服务</li>
                <li>不尝试破坏或干扰我们的系统</li>
                <li>不将服务用于任何非法活动</li>
                <li>尊重其他用户的使用权利</li>
              </ul>
            </div>
          </Card>

          {/* 禁止行为 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ❌ 禁止行为
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>您不得：</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>使用自动化工具过度请求我们的服务</li>
                <li>尝试逆向工程或破解我们的系统</li>
                <li>上传恶意代码或病毒</li>
                <li>侵犯他人的知识产权</li>
                <li>进行任何可能损害我们服务的行为</li>
              </ul>
            </div>
          </Card>

          {/* 服务可用性 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🔄 服务可用性
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                我们努力保持服务的高可用性，但不保证服务将始终可用。
                我们可能会因以下原因暂停或中断服务：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>系统维护和更新</li>
                <li>技术故障或网络问题</li>
                <li>不可抗力因素</li>
                <li>安全威胁或滥用行为</li>
              </ul>
            </div>
          </Card>

          {/* 知识产权 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🏛️ 知识产权
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                我们的服务及其内容（包括但不限于文本、图形、软件、商标等）
                受版权法和其他知识产权法保护。
              </p>
              <p>
                您通过我们的服务处理的数据归您所有，我们不会声称对这些数据的所有权。
              </p>
            </div>
          </Card>

          {/* 免责声明 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ⚠️ 免责声明
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                我们的服务按"现状"提供，不提供任何明示或暗示的保证。
                我们不保证服务将满足您的需求或期望。
              </p>
              <p>
                对于因使用我们的服务而产生的任何直接、间接、偶然或后果性损害，
                我们不承担责任。
              </p>
            </div>
          </Card>

          {/* 服务变更 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🔧 服务变更
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                我们保留随时修改、暂停或终止服务的权利，无需事先通知。
                我们可能会添加新功能、修改现有功能或删除某些功能。
              </p>
              <p>
                重大变更将通过网站公告的方式通知用户。
              </p>
            </div>
          </Card>

          {/* 条款变更 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📝 条款变更
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                我们可能会不时更新本服务条款。更新后的条款将在网站上发布，
                并立即生效。
              </p>
              <p>
                继续使用我们的服务即表示您接受更新后的条款。
                如果您不同意更新后的条款，请停止使用我们的服务。
              </p>
            </div>
          </Card>

          {/* 联系我们 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📞 联系我们
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                如果您对本服务条款有任何疑问或建议，请通过以下方式联系我们：
              </p>
              <div className="space-y-2">
                <p>邮箱：admin@tion.work</p>
              </div>
            </div>
          </Card>

          {/* 生效日期 */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📅 生效日期
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                本服务条款自您首次使用我们的服务时生效。
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
