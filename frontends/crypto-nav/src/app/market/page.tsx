"use client";

import { Card } from "@/components/ui/Card";
import {
  Activity,
  BarChart3,
  Globe,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
  rank: number;
}

export default function MarketPage() {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");

  // 模拟市场数据
  const mockData: CryptoData[] = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 43250.5,
      change24h: 1250.3,
      changePercent24h: 2.98,
      marketCap: 847500000000,
      volume24h: 28500000000,
      rank: 1,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 2650.75,
      change24h: -45.25,
      changePercent24h: -1.68,
      marketCap: 318500000000,
      volume24h: 15200000000,
      rank: 2,
    },
    {
      symbol: "BNB",
      name: "Binance Coin",
      price: 315.8,
      change24h: 8.45,
      changePercent24h: 2.75,
      marketCap: 47500000000,
      volume24h: 1200000000,
      rank: 3,
    },
    {
      symbol: "ADA",
      name: "Cardano",
      price: 0.485,
      change24h: 0.025,
      changePercent24h: 5.44,
      marketCap: 17200000000,
      volume24h: 850000000,
      rank: 4,
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: 98.45,
      change24h: -2.15,
      changePercent24h: -2.14,
      marketCap: 42500000000,
      volume24h: 2100000000,
      rank: 5,
    },
    {
      symbol: "MATIC",
      name: "Polygon",
      price: 0.875,
      change24h: 0.045,
      changePercent24h: 5.42,
      marketCap: 8200000000,
      volume24h: 450000000,
      rank: 6,
    },
  ];

  useEffect(() => {
    // 模拟API调用
    const fetchData = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCryptoData(mockData);
      setLoading(false);
    };

    fetchData();
  }, [selectedTimeframe]);

  const formatNumber = (num: number, decimals: number = 2) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatPrice = (price: number) => {
    if (price >= 1000)
      return `$${price.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`;
    if (price >= 1) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载市场数据中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              加密货币市场数据
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            实时加密货币价格、市值和交易量数据
          </p>
        </div>

        {/* 时间框架选择 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            {["1h", "24h", "7d", "30d"].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        {/* 市场概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Globe className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">总市值</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">$1.65T</p>
            <p className="text-sm text-green-600">+2.5%</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">
                24h交易量
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">$45.2B</p>
            <p className="text-sm text-red-600">-8.3%</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">
                比特币占比
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">51.2%</p>
            <p className="text-sm text-green-600">+0.8%</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">
                恐惧贪婪指数
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">65</p>
            <p className="text-sm text-yellow-600">贪婪</p>
          </Card>
        </div>

        {/* 加密货币列表 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              热门加密货币
            </h2>
            <div className="text-sm text-gray-500">
              数据更新时间: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    #
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    名称
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    价格
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    24h变化
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    市值
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    24h交易量
                  </th>
                </tr>
              </thead>
              <tbody>
                {cryptoData.map((crypto) => (
                  <tr
                    key={crypto.symbol}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-4 text-gray-600">{crypto.rank}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">
                            {crypto.symbol.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {crypto.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {crypto.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono">
                      {formatPrice(crypto.price)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div
                        className={`flex items-center justify-end gap-1 ${
                          crypto.changePercent24h >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {crypto.changePercent24h >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          {crypto.changePercent24h >= 0 ? "+" : ""}
                          {crypto.changePercent24h.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {crypto.change24h >= 0 ? "+" : ""}
                        {formatPrice(Math.abs(crypto.change24h))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono">
                      {formatNumber(crypto.marketCap)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono">
                      {formatNumber(crypto.volume24h)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 市场趋势图表占位 */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">市场趋势</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>图表功能开发中...</p>
            </div>
          </div>
        </Card>

        {/* 免责声明 */}
        <Card className="mt-8 p-6 bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">免责声明</h3>
          <p className="text-sm text-gray-600">
            本页面显示的数据仅供参考，不构成投资建议。加密货币市场波动性极大，
            投资前请充分了解风险并谨慎决策。数据可能存在延迟，请以官方交易所数据为准。
          </p>
        </Card>
      </div>
    </div>
  );
}
