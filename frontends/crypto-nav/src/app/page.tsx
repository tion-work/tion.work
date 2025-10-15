"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  ExternalLink,
  Globe,
  Shield,
  Star,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// 加密货币网站分类
const cryptoWebsites = [
  {
    category: "交易所",
    icon: TrendingUp,
    color: "bg-green-500",
    sites: [
      {
        name: "币安",
        url: "https://binance.com",
        description: "全球最大加密货币交易所",
      },
      {
        name: "欧易",
        url: "https://okx.com",
        description: "知名数字资产交易平台",
      },
      {
        name: "Coinbase",
        url: "https://coinbase.com",
        description: "美国最大加密货币交易所",
      },
      {
        name: "火币",
        url: "https://huobi.com",
        description: "老牌数字资产交易平台",
      },
    ],
  },
  {
    category: "DeFi协议",
    icon: Globe,
    color: "bg-blue-500",
    sites: [
      {
        name: "Uniswap",
        url: "https://uniswap.org",
        description: "去中心化交易协议",
      },
      {
        name: "Compound",
        url: "https://compound.finance",
        description: "借贷协议",
      },
      { name: "Aave", url: "https://aave.com", description: "流动性协议" },
      {
        name: "MakerDAO",
        url: "https://makerdao.com",
        description: "稳定币协议",
      },
    ],
  },
  {
    category: "数据分析",
    icon: BarChart3,
    color: "bg-purple-500",
    sites: [
      {
        name: "CoinGecko",
        url: "https://coingecko.com",
        description: "加密货币市场数据",
      },
      {
        name: "CoinMarketCap",
        url: "https://coinmarketcap.com",
        description: "市值排名平台",
      },
      {
        name: "DeFiPulse",
        url: "https://defipulse.com",
        description: "DeFi数据追踪",
      },
      {
        name: "Dune Analytics",
        url: "https://dune.com",
        description: "链上数据分析",
      },
    ],
  },
  {
    category: "区块链浏览器",
    icon: Shield,
    color: "bg-orange-500",
    sites: [
      {
        name: "Etherscan",
        url: "https://etherscan.io",
        description: "以太坊区块链浏览器",
      },
      {
        name: "BSCScan",
        url: "https://bscscan.com",
        description: "BSC区块链浏览器",
      },
      {
        name: "PolygonScan",
        url: "https://polygonscan.com",
        description: "Polygon区块链浏览器",
      },
      {
        name: "Solscan",
        url: "https://solscan.io",
        description: "Solana区块链浏览器",
      },
    ],
  },
];

// 工具分类
const cryptoTools = [
  {
    category: "计算工具",
    icon: Calculator,
    color: "bg-indigo-500",
    tools: [
      {
        name: "收益计算器",
        description: "计算投资收益率",
        href: "/tools/calculator",
      },
      { name: "DCA计算器", description: "定投策略计算", href: "/tools/dca" },
      {
        name: "复利计算器",
        description: "复利投资计算",
        href: "/tools/compound",
      },
      { name: "FIRE计算器", description: "财务自由规划", href: "/tools/fire" },
    ],
  },
  {
    category: "安全工具",
    icon: Shield,
    color: "bg-red-500",
    tools: [
      {
        name: "地址验证",
        description: "验证钱包地址有效性",
        href: "/tools/address-validator",
      },
      {
        name: "合约检测",
        description: "智能合约安全检测",
        href: "/tools/contract-check",
      },
      {
        name: "私钥生成",
        description: "安全私钥生成器",
        href: "/tools/key-generator",
      },
    ],
  },
  {
    category: "技术分析",
    icon: BarChart3,
    color: "bg-green-500",
    tools: [
      {
        name: "K线分析",
        description: "技术指标分析工具",
        href: "/tools/chart",
      },
      { name: "趋势分析", description: "市场趋势判断", href: "/tools/trend" },
      {
        name: "支撑阻力",
        description: "关键位分析",
        href: "/tools/support-resistance",
      },
    ],
  },
];

// 教程分类
const tutorials = [
  {
    title: "新手入门",
    icon: BookOpen,
    color: "bg-blue-500",
    items: [
      { title: "什么是加密货币？", href: "/tutorials/what-is-crypto" },
      { title: "如何购买第一个比特币", href: "/tutorials/buy-first-bitcoin" },
      { title: "钱包使用指南", href: "/tutorials/wallet-guide" },
    ],
  },
  {
    title: "DeFi操作",
    icon: Globe,
    color: "bg-green-500",
    items: [
      { title: "如何参与流动性挖矿", href: "/tutorials/liquidity-mining" },
      { title: "DeFi借贷操作指南", href: "/tutorials/defi-lending" },
      { title: "DEX交易教程", href: "/tutorials/dex-trading" },
    ],
  },
  {
    title: "安全防护",
    icon: Shield,
    color: "bg-red-500",
    items: [
      { title: "如何保护私钥安全", href: "/tutorials/private-key-security" },
      { title: "识别常见骗局", href: "/tutorials/scam-prevention" },
      { title: "硬件钱包使用", href: "/tutorials/hardware-wallet" },
    ],
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("websites");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              crypto.tion.work
            </h1>
            <p className="text-2xl text-gray-600 mb-4">
              🚀 专为加密货币投资者而生
            </p>
            <p className="text-lg text-gray-500 mb-8">
              聚合优质网站、教程、工具，一站式加密货币投资导航平台
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white rounded-lg px-6 py-3 shadow-md">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">20+</span>
                <span className="text-gray-600">精选网站</span>
              </div>
            </div>
            <div className="bg-white rounded-lg px-6 py-3 shadow-md">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-500" />
                <span className="font-semibold">50+</span>
                <span className="text-gray-600">教程文章</span>
              </div>
            </div>
            <div className="bg-white rounded-lg px-6 py-3 shadow-md">
              <div className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-purple-500" />
                <span className="font-semibold">15+</span>
                <span className="text-gray-600">专业工具</span>
              </div>
            </div>
            <div className="bg-white rounded-lg px-6 py-3 shadow-md">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">100%</span>
                <span className="text-gray-600">免费使用</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button size="lg" className="text-lg px-8 py-4">
              开始探索
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500">
              零注册使用 • 实时更新 • 响应式设计
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTab("websites")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "websites"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Globe className="inline h-4 w-4 mr-2" />
              网站导航
            </button>
            <button
              onClick={() => setActiveTab("tools")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "tools"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Wrench className="inline h-4 w-4 mr-2" />
              专业工具
            </button>
            <button
              onClick={() => setActiveTab("tutorials")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === "tutorials"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <BookOpen className="inline h-4 w-4 mr-2" />
              教程中心
            </button>
          </div>

          {/* Websites Tab */}
          {activeTab === "websites" && (
            <div className="space-y-8">
              {cryptoWebsites.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`h-8 w-8 rounded-lg ${category.color} flex items-center justify-center`}
                    >
                      <category.icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {category.category}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {category.sites.map((site, siteIndex) => (
                      <Card
                        key={siteIndex}
                        className="p-4 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {site.name}
                          </h4>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          {site.description}
                        </p>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          访问网站 →
                        </a>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tools Tab */}
          {activeTab === "tools" && (
            <div className="space-y-8">
              {cryptoTools.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`h-8 w-8 rounded-lg ${category.color} flex items-center justify-center`}
                    >
                      <category.icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {category.category}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.tools.map((tool, toolIndex) => (
                      <Link key={toolIndex} href={tool.href}>
                        <Card className="p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {tool.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {tool.description}
                          </p>
                          <div className="flex items-center text-blue-600 text-sm font-medium">
                            使用工具
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tutorials Tab */}
          {activeTab === "tutorials" && (
            <div className="space-y-8">
              {tutorials.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`h-8 w-8 rounded-lg ${category.color} flex items-center justify-center`}
                    >
                      <category.icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {category.title}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.items.map((item, itemIndex) => (
                      <Link key={itemIndex} href={item.href}>
                        <Card className="p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            {item.title}
                          </h4>
                          <div className="flex items-center text-blue-600 text-sm font-medium">
                            阅读教程
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              为什么选择 crypto.tion.work？
            </h2>
            <p className="text-lg text-gray-600">
              资源优质、实时更新、新手友好、完全免费
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                资源优质
              </h3>
              <p className="text-gray-600">精心挑选的优质加密货币资源</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                实时更新
              </h3>
              <p className="text-gray-600">每周更新最新资源和工具</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                新手友好
              </h3>
              <p className="text-gray-600">专门为新手投资者设计</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                完全免费
              </h3>
              <p className="text-gray-600">建站初衷，完全免费使用</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备开始加密货币投资之旅了吗？
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            加入数万加密货币投资者大家庭，实现财富自由！
          </p>
          <div className="space-x-4">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              立即开始使用
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600"
            >
              浏览投资网站
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
