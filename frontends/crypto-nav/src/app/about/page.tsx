import { Card } from "@/components/ui/Card";
import { Globe, Shield, Star, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              关于 crypto.tion.work
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            专为加密货币投资者而生的导航平台
          </p>
        </div>

        <div className="space-y-8">
          {/* 项目介绍 */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              项目介绍
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                crypto.tion.work
                是一个专为加密货币投资者设计的导航平台，旨在为用户提供一站式的投资资源和服务。
                我们聚合了全球优质的加密货币网站、教程、工具，帮助投资者更高效地进行投资决策。
              </p>
              <p>
                作为 tion.work
                生态系统的一部分，我们致力于为加密货币社区提供免费、优质、实用的服务。
                无论您是投资新手还是资深投资者，都能在这里找到适合您的资源和工具。
              </p>
            </div>
          </Card>

          {/* 核心价值 */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              核心价值
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    资源优质
                  </h3>
                  <p className="text-gray-600">
                    精心挑选和验证的优质资源，确保用户获得准确、有价值的信息
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    新手友好
                  </h3>
                  <p className="text-gray-600">
                    专门为投资新手设计，提供详细的教程和指导，降低学习门槛
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    实时更新
                  </h3>
                  <p className="text-gray-600">
                    定期更新最新资源和工具，确保用户获得最新的市场信息
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    完全免费
                  </h3>
                  <p className="text-gray-600">
                    坚持免费使用原则，让所有用户都能享受到优质的服务
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* 功能特色 */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              功能特色
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  网站导航
                </h3>
                <p className="text-gray-600">
                  聚合全球优质加密货币网站，包括交易所、DeFi协议、数据分析平台、区块链浏览器等，
                  为用户提供便捷的访问入口。
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  专业工具
                </h3>
                <p className="text-gray-600">
                  提供实用的投资计算工具，包括收益计算器、DCA定投计算器、复利计算器等，
                  帮助用户进行投资决策和规划。
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  教程中心
                </h3>
                <p className="text-gray-600">
                  系统化的学习资源，涵盖新手入门、DeFi操作、安全防护等各个方面，
                  帮助用户提升投资技能和风险意识。
                </p>
              </div>
            </div>
          </Card>

          {/* 技术架构 */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              技术架构
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                本项目采用现代化的技术栈构建，确保高性能、高可用性和良好的用户体验：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>前端框架：</strong>Next.js 15 + React
                  19，提供现代化的开发体验
                </li>
                <li>
                  <strong>样式系统：</strong>Tailwind CSS，快速构建响应式界面
                </li>
                <li>
                  <strong>类型安全：</strong>TypeScript，确保代码质量和开发效率
                </li>
                <li>
                  <strong>组件库：</strong>自建UI组件库，保持设计一致性
                </li>
                <li>
                  <strong>部署方案：</strong>Netlify，快速部署和全球CDN加速
                </li>
              </ul>
            </div>
          </Card>

          {/* 联系我们 */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              联系我们
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                如果您有任何建议、问题或合作意向，欢迎通过以下方式联系我们：
              </p>
              <div className="space-y-2">
                <p>📧 邮箱：contact@tion.work</p>
                <p>🐙 GitHub：https://github.com/tion-work</p>
                <p>🐦 Twitter：@tion_work</p>
              </div>
            </div>
          </Card>

          {/* 免责声明 */}
          <Card className="p-8 bg-yellow-50 border-yellow-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              免责声明
            </h2>
            <div className="space-y-2 text-gray-600">
              <p>
                本网站提供的所有信息、工具和计算器仅供参考，不构成投资建议。
                加密货币投资存在风险，价格可能大幅波动，可能导致投资损失。
              </p>
              <p>
                在做出任何投资决策之前，请务必进行充分的研究，并考虑您的财务状况和风险承受能力。
                我们不对任何投资损失承担责任。
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
