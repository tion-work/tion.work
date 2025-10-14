"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { BarChart3, Calendar, DollarSign, TrendingUp } from "lucide-react";
import { useState } from "react";

interface CompoundResult {
  principal: number;
  finalAmount: number;
  totalInterest: number;
  interestPercentage: number;
  years: number;
  monthlyContribution: number;
  totalContributions: number;
}

export default function CompoundPage() {
  const [principal, setPrincipal] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<CompoundResult | null>(null);

  const calculateCompound = () => {
    const p = parseFloat(principal) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = parseFloat(annualRate) / 100 || 0;
    const timeYears = parseFloat(years) || 0;

    if (timeYears <= 0) return;

    const monthlyRate = rate / 12;
    const totalMonths = timeYears * 12;

    // 计算复利
    const futureValueOfPrincipal = p * Math.pow(1 + rate, timeYears);

    // 计算定期投资的未来价值
    const futureValueOfAnnuity =
      monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);

    const finalAmount = futureValueOfPrincipal + futureValueOfAnnuity;
    const totalContributions = p + monthly * totalMonths;
    const totalInterest = finalAmount - totalContributions;
    const interestPercentage = (totalInterest / totalContributions) * 100;

    setResult({
      principal: p,
      finalAmount,
      totalInterest,
      interestPercentage,
      years: timeYears,
      monthlyContribution: monthly,
      totalContributions,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-indigo-500 rounded-full w-12 h-12 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">复利计算器</h1>
          </div>
          <p className="text-lg text-gray-600">
            计算复利投资的长期收益和财富增长
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              投资参数
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  初始投资金额 (USD)
                </label>
                <Input
                  type="number"
                  placeholder="例如: 10000"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  每月追加投资 (USD)
                </label>
                <Input
                  type="number"
                  placeholder="例如: 500"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年化收益率 (%)
                </label>
                <Input
                  type="number"
                  placeholder="例如: 8"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  建议参考历史市场平均收益率
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  投资年限
                </label>
                <Input
                  type="number"
                  placeholder="例如: 20"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
              </div>

              <Button onClick={calculateCompound} className="w-full">
                计算复利收益
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
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium text-indigo-800">
                      最终金额
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-indigo-900">
                    $
                    {result.finalAmount.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">总收益</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    $
                    {result.totalInterest.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-sm text-green-700">
                    ({result.interestPercentage.toFixed(2)}%)
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">投资期间</span>
                  </div>
                  <p className="text-xl font-bold text-blue-900">
                    {result.years} 年
                  </p>
                  <p className="text-sm text-blue-700">
                    总投入: $
                    {result.totalContributions.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">
                      收益倍数
                    </span>
                  </div>
                  <p className="text-xl font-bold text-purple-900">
                    {(result.finalAmount / result.totalContributions).toFixed(
                      2
                    )}
                    x
                  </p>
                  <p className="text-sm text-purple-700">
                    最终金额是总投入的{" "}
                    {(result.finalAmount / result.totalContributions).toFixed(
                      2
                    )}{" "}
                    倍
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>输入参数后点击&ldquo;计算复利收益&rdquo;查看结果</p>
              </div>
            )}
          </Card>
        </div>

        {/* 复利效应说明 */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            复利效应说明
          </h3>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  什么是复利？
                </h4>
                <p>
                  复利是指投资收益再投资产生的收益，即&ldquo;利滚利&rdquo;。
                  时间越长，复利效应越明显，是财富增长的重要驱动力。
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">复利公式</h4>
                <p className="font-mono text-xs bg-gray-100 p-2 rounded">
                  A = P(1 + r)^t + PMT × [((1 + r)^t - 1) / r]
                </p>
                <p className="text-xs mt-1">
                  A=最终金额, P=本金, r=年利率, t=年数, PMT=定期投资
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">关键因素</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>时间：时间越长，复利效应越强</li>
                  <li>收益率：收益率越高，增长越快</li>
                  <li>定期投资：持续投资增加本金</li>
                  <li>复利频率：复利计算越频繁越好</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">投资建议</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>尽早开始投资</li>
                  <li>保持长期投资心态</li>
                  <li>选择稳健的投资标的</li>
                  <li>定期调整投资组合</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              ⚠️ 此计算器仅供参考，实际投资存在风险，请谨慎决策
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
