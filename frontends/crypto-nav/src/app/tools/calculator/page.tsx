"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Calculator, DollarSign, Percent, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function CalculatorPage() {
  const [initialAmount, setInitialAmount] = useState("");
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [annualReturn, setAnnualReturn] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<{
    totalInvested: number;
    finalValue: number;
    totalReturn: number;
    returnPercentage: number;
  } | null>(null);

  const calculateInvestment = () => {
    const initial = parseFloat(initialAmount) || 0;
    const monthly = parseFloat(monthlyInvestment) || 0;
    const returnRate = parseFloat(annualReturn) / 100 || 0;
    const timeYears = parseFloat(years) || 0;

    if (timeYears <= 0) return;

    const monthlyRate = returnRate / 12;
    const totalMonths = timeYears * 12;

    // 计算最终价值
    const futureValueOfInitial = initial * Math.pow(1 + returnRate, timeYears);
    const futureValueOfAnnuity =
      monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    const finalValue = futureValueOfInitial + futureValueOfAnnuity;

    const totalInvested = initial + monthly * totalMonths;
    const totalReturn = finalValue - totalInvested;
    const returnPercentage = (totalReturn / totalInvested) * 100;

    setResult({
      totalInvested,
      finalValue,
      totalReturn,
      returnPercentage,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              加密货币收益计算器
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            计算您的加密货币投资收益率和最终价值
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
                  placeholder="例如: 1000"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  每月定投金额 (USD)
                </label>
                <Input
                  type="number"
                  placeholder="例如: 100"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  预期年化收益率 (%)
                </label>
                <Input
                  type="number"
                  placeholder="例如: 10"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  投资年限
                </label>
                <Input
                  type="number"
                  placeholder="例如: 5"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
              </div>

              <Button onClick={calculateInvestment} className="w-full">
                计算收益
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
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-purple-800">收益率</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {result.returnPercentage.toFixed(2)}%
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
                <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>输入参数后点击&ldquo;计算收益&rdquo;查看结果</p>
              </div>
            )}
          </Card>
        </div>

        {/* 说明信息 */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">使用说明</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>初始投资金额：</strong>您计划一次性投入的资金
            </p>
            <p>
              • <strong>每月定投金额：</strong>每月定期投资的金额（DCA策略）
            </p>
            <p>
              • <strong>预期年化收益率：</strong>
              根据历史数据或您的预期设定的年化收益率
            </p>
            <p>
              • <strong>投资年限：</strong>计划投资的年数
            </p>
            <p className="text-xs text-gray-500 mt-4">
              ⚠️ 此计算器仅供参考，实际投资存在风险，请谨慎决策
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
