"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { BarChart3, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { useState } from "react";

interface DCAResult {
  totalInvested: number;
  finalValue: number;
  totalReturn: number;
  returnPercentage: number;
  averagePrice: number;
  currentPrice: number;
  profit: number;
  profitPercentage: number;
}

export default function DCAPage() {
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [months, setMonths] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [priceData, setPriceData] = useState<number[]>([]);
  const [result, setResult] = useState<DCAResult | null>(null);

  const generatePriceData = (months: number, currentPrice: number) => {
    // 模拟价格波动数据（简化版）
    const data: number[] = [];
    const volatility = 0.3; // 30% 波动率

    for (let i = 0; i < months; i++) {
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = currentPrice * (1 + randomChange);
      data.push(Math.max(price, currentPrice * 0.3)); // 确保价格不会太低
    }

    return data;
  };

  const calculateDCA = () => {
    const monthly = parseFloat(monthlyAmount) || 0;
    const totalMonths = parseInt(months) || 0;
    const current = parseFloat(currentPrice) || 0;

    if (monthly <= 0 || totalMonths <= 0 || current <= 0) return;

    // 生成价格数据
    const prices = generatePriceData(totalMonths, current);
    setPriceData(prices);

    let totalCoins = 0;
    let totalInvested = 0;

    // 模拟每月定投
    for (let i = 0; i < totalMonths; i++) {
      const monthlyPrice = prices[i];
      const coinsBought = monthly / monthlyPrice;
      totalCoins += coinsBought;
      totalInvested += monthly;
    }

    const finalValue = totalCoins * current;
    const totalReturn = finalValue - totalInvested;
    const returnPercentage = (totalReturn / totalInvested) * 100;
    const averagePrice = totalInvested / totalCoins;
    const profit = totalCoins * (current - averagePrice);
    const profitPercentage = ((current - averagePrice) / averagePrice) * 100;

    setResult({
      totalInvested,
      finalValue,
      totalReturn,
      returnPercentage,
      averagePrice,
      currentPrice: current,
      profit,
      profitPercentage,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">DCA定投计算器</h1>
          </div>
          <p className="text-lg text-gray-600">
            计算定期定额投资策略的收益和成本平均效果
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              定投参数
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  每月定投金额 (USD)
                </label>
                <Input
                  type="number"
                  placeholder="例如: 100"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  定投月数
                </label>
                <Input
                  type="number"
                  placeholder="例如: 12"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  当前价格 (USD)
                </label>
                <Input
                  type="number"
                  placeholder="例如: 50000"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                />
              </div>

              <Button onClick={calculateDCA} className="w-full">
                计算DCA收益
              </Button>
            </div>
          </Card>

          {/* 结果展示 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              计算结果
            </h2>
            {result ? (
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">最终价值</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    $
                    {result.finalValue.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">总收益</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    $
                    {result.totalReturn.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-sm text-blue-700">
                    ({result.returnPercentage.toFixed(2)}%)
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">
                      平均成本
                    </span>
                  </div>
                  <p className="text-xl font-bold text-purple-900">
                    $
                    {result.averagePrice.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-sm text-purple-700">
                    当前价格: $
                    {result.currentPrice.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-orange-800">
                      成本优势
                    </span>
                  </div>
                  <p className="text-xl font-bold text-orange-900">
                    {result.profitPercentage.toFixed(2)}%
                  </p>
                  <p className="text-sm text-orange-700">
                    相比当前价格节省: $
                    {result.profit.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">总投入</span>
                    <span className="text-lg font-semibold text-gray-900">
                      $
                      {result.totalInvested.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>输入参数后点击&ldquo;计算DCA收益&rdquo;查看结果</p>
              </div>
            )}
          </Card>
        </div>

        {/* 价格走势图（简化版） */}
        {priceData.length > 0 && (
          <Card className="mt-8 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              模拟价格走势
            </h3>
            <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end justify-between">
              {priceData.map((price, index) => {
                const maxPrice = Math.max(...priceData);
                const minPrice = Math.min(...priceData);
                const height =
                  ((price - minPrice) / (maxPrice - minPrice)) * 200;
                return (
                  <div
                    key={index}
                    className="bg-blue-500 rounded-t"
                    style={{
                      width: `${100 / priceData.length}%`,
                      height: `${height}px`,
                      minHeight: "4px",
                    }}
                    title={`第${index + 1}月: $${price.toFixed(2)}`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>开始</span>
              <span>结束</span>
            </div>
          </Card>
        )}

        {/* 说明信息 */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            DCA策略说明
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>DCA (Dollar Cost Averaging)：</strong>
              定期定额投资策略，通过分散投资时间降低市场波动风险
            </p>
            <p>
              • <strong>成本平均效应：</strong>
              在价格低时买入更多，价格高时买入较少，从而降低平均成本
            </p>
            <p>
              • <strong>适合场景：</strong>
              长期投资、市场波动较大、不想择时的投资者
            </p>
            <p>
              • <strong>注意事项：</strong>需要坚持长期执行，避免情绪化操作
            </p>
            <p className="text-xs text-gray-500 mt-4">
              ⚠️ 此计算器使用模拟数据，实际投资存在风险，请谨慎决策
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
