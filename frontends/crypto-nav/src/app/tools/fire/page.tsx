"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Calendar, DollarSign, Target, TrendingUp } from "lucide-react";
import { useState } from "react";

interface FIREResult {
  fireNumber: number;
  yearsToFire: number;
  monthlyInvestment: number;
  totalInvested: number;
  finalValue: number;
  annualExpenses: number;
  withdrawalRate: number;
}

export default function FIREPage() {
  const [annualExpenses, setAnnualExpenses] = useState("");
  const [withdrawalRate, setWithdrawalRate] = useState("4");
  const [currentAge, setCurrentAge] = useState("");
  const [targetAge, setTargetAge] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("7");
  const [result, setResult] = useState<FIREResult | null>(null);

  const calculateFIRE = () => {
    const expenses = parseFloat(annualExpenses) || 0;
    const rate = parseFloat(withdrawalRate) / 100 || 0.04;
    const age = parseInt(currentAge) || 0;
    const target = parseInt(targetAge) || 0;
    const savings = parseFloat(currentSavings) || 0;
    const returnRate = parseFloat(expectedReturn) / 100 || 0.07;

    if (expenses <= 0 || age <= 0 || target <= age) return;

    // FIRE数字 = 年支出 / 提取率
    const fireNumber = expenses / rate;

    // 计算需要的月投资额
    const yearsToFire = target - age;
    const monthsToFire = yearsToFire * 12;
    const monthlyReturnRate = returnRate / 12;

    // 使用年金现值公式计算月投资额
    const futureValueOfSavings =
      savings * Math.pow(1 + returnRate, yearsToFire);
    const remainingNeeded = fireNumber - futureValueOfSavings;

    let monthlyInvestment = 0;
    if (remainingNeeded > 0) {
      monthlyInvestment =
        remainingNeeded /
        ((Math.pow(1 + monthlyReturnRate, monthsToFire) - 1) /
          monthlyReturnRate);
    }

    const totalInvested = savings + monthlyInvestment * monthsToFire;
    const finalValue =
      futureValueOfSavings +
      monthlyInvestment *
        ((Math.pow(1 + monthlyReturnRate, monthsToFire) - 1) /
          monthlyReturnRate);

    setResult({
      fireNumber,
      yearsToFire,
      monthlyInvestment,
      totalInvested,
      finalValue,
      annualExpenses: expenses,
      withdrawalRate: rate * 100,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-purple-500 rounded-full w-12 h-12 flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              FIRE财务自由计算器
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            计算实现财务自由（FIRE）所需的投资金额和时间
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 输入表单 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              FIRE参数设置
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年生活支出 (USD)
                </label>
                <Input
                  type="number"
                  placeholder="例如: 50000"
                  value={annualExpenses}
                  onChange={(e) => setAnnualExpenses(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  退休后每年需要的生活费用
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  安全提取率 (%)
                </label>
                <Input
                  type="number"
                  placeholder="例如: 4"
                  value={withdrawalRate}
                  onChange={(e) => setWithdrawalRate(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  建议4%，即每年提取投资组合的4%
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    当前年龄
                  </label>
                  <Input
                    type="number"
                    placeholder="例如: 25"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目标退休年龄
                  </label>
                  <Input
                    type="number"
                    placeholder="例如: 45"
                    value={targetAge}
                    onChange={(e) => setTargetAge(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  当前储蓄 (USD)
                </label>
                <Input
                  type="number"
                  placeholder="例如: 10000"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  预期年化收益率 (%)
                </label>
                <Input
                  type="number"
                  placeholder="例如: 7"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  建议7-10%，基于历史市场表现
                </p>
              </div>

              <Button onClick={calculateFIRE} className="w-full">
                计算FIRE计划
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
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">
                      FIRE数字
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    $
                    {result.fireNumber.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-sm text-purple-700">
                    实现财务自由需要的总资产
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">时间规划</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {result.yearsToFire} 年
                  </p>
                  <p className="text-sm text-blue-700">
                    距离财务自由还有 {result.yearsToFire} 年
                  </p>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">月投资额</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    $
                    {result.monthlyInvestment.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-sm text-green-700">每月需要投资的金额</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    <span className="font-medium text-orange-800">
                      投资总额
                    </span>
                  </div>
                  <p className="text-xl font-bold text-orange-900">
                    $
                    {result.totalInvested.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                  <p className="text-sm text-orange-700">
                    最终投资组合价值: $
                    {result.finalValue.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">年生活支出</span>
                      <span className="font-medium">
                        $
                        {result.annualExpenses.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">安全提取率</span>
                      <span className="font-medium">
                        {result.withdrawalRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>输入参数后点击&ldquo;计算FIRE计划&rdquo;查看结果</p>
              </div>
            )}
          </Card>
        </div>

        {/* FIRE策略说明 */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            FIRE策略说明
          </h3>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  什么是FIRE？
                </h4>
                <p>
                  FIRE (Financial Independence, Retire Early)
                  是一种财务自由理念， 通过高储蓄率和投资来实现提前退休的目标。
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">4%规则</h4>
                <p>
                  基于历史数据，每年提取投资组合的4%作为生活费，
                  理论上可以维持30年的退休生活。
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">FIRE类型</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Lean FIRE: 年支出 &lt; $25,000</li>
                  <li>Regular FIRE: 年支出 $25,000-$50,000</li>
                  <li>Fat FIRE: 年支出 &gt; $50,000</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">实现策略</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>提高储蓄率至50%以上</li>
                  <li>投资低成本指数基金</li>
                  <li>多元化投资组合</li>
                  <li>持续学习和优化</li>
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
