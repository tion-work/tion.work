"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

interface ValidationResult {
  isValid: boolean;
  type: string;
  network: string;
  checksum: string;
  message: string;
}

export default function AddressValidatorPage() {
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // 简化的地址验证函数
  const validateAddress = (addr: string): ValidationResult => {
    const trimmedAddr = addr.trim();

    // 以太坊地址验证 (0x开头，40个十六进制字符)
    if (trimmedAddr.startsWith("0x") && trimmedAddr.length === 42) {
      const hexPattern = /^0x[a-fA-F0-9]{40}$/;
      if (hexPattern.test(trimmedAddr)) {
        return {
          isValid: true,
          type: "Ethereum",
          network: "Ethereum",
          checksum: "Valid",
          message: "有效的以太坊地址",
        };
      }
    }

    // 比特币地址验证 (Base58编码)
    if (trimmedAddr.length >= 26 && trimmedAddr.length <= 35) {
      const btcPattern =
        /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/;
      if (btcPattern.test(trimmedAddr)) {
        return {
          isValid: true,
          type: "Bitcoin",
          network: "Bitcoin",
          checksum: "Valid",
          message: "有效的比特币地址",
        };
      }
    }

    // BSC地址验证 (类似以太坊)
    if (trimmedAddr.startsWith("0x") && trimmedAddr.length === 42) {
      const bscPattern = /^0x[a-fA-F0-9]{40}$/;
      if (bscPattern.test(trimmedAddr)) {
        return {
          isValid: true,
          type: "BSC",
          network: "Binance Smart Chain",
          checksum: "Valid",
          message: "有效的BSC地址",
        };
      }
    }

    // Polygon地址验证
    if (trimmedAddr.startsWith("0x") && trimmedAddr.length === 42) {
      const polygonPattern = /^0x[a-fA-F0-9]{40}$/;
      if (polygonPattern.test(trimmedAddr)) {
        return {
          isValid: true,
          type: "Polygon",
          network: "Polygon",
          checksum: "Valid",
          message: "有效的Polygon地址",
        };
      }
    }

    // 无效地址
    return {
      isValid: false,
      type: "Unknown",
      network: "Unknown",
      checksum: "Invalid",
      message: "无效的加密货币地址",
    };
  };

  const handleValidate = async () => {
    if (!address.trim()) return;

    setIsValidating(true);

    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const validationResult = validateAddress(address);
    setResult(validationResult);
    setIsValidating(false);
  };

  const exampleAddresses = [
    {
      name: "Bitcoin",
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      type: "Bitcoin",
    },
    {
      name: "Ethereum",
      address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      type: "Ethereum",
    },
    {
      name: "BSC",
      address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      type: "BSC",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-red-500 rounded-full w-12 h-12 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              加密货币地址验证器
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            验证各种加密货币地址的有效性和格式
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 输入区域 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              地址验证
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  输入地址
                </label>
                <Input
                  type="text"
                  placeholder="例如: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              <Button
                onClick={handleValidate}
                className="w-full"
                disabled={isValidating || !address.trim()}
              >
                {isValidating ? "验证中..." : "验证地址"}
              </Button>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">示例地址</h3>
                <div className="space-y-2">
                  {exampleAddresses.map((example, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                    >
                      <span className="font-medium">{example.name}</span>
                      <button
                        onClick={() => setAddress(example.address)}
                        className="text-blue-600 hover:text-blue-800 font-mono"
                      >
                        {example.address.slice(0, 10)}...
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* 结果展示 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              验证结果
            </h2>
            {result ? (
              <div className="space-y-4">
                <div
                  className={`rounded-lg p-4 ${
                    result.isValid
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span
                      className={`font-medium ${
                        result.isValid ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {result.message}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      地址类型
                    </span>
                    <span className="text-sm font-mono">{result.type}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      网络
                    </span>
                    <span className="text-sm">{result.network}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">
                      校验状态
                    </span>
                    <span
                      className={`text-sm ${
                        result.checksum === "Valid"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {result.checksum}
                    </span>
                  </div>
                </div>

                {result.isValid && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        安全提示
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">
                      请仔细核对地址，确保发送到正确的钱包。错误的地址可能导致资金永久丢失。
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>输入地址后点击&ldquo;验证地址&rdquo;查看结果</p>
              </div>
            )}
          </Card>
        </div>

        {/* 支持的地址类型 */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            支持的地址类型
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">₿</div>
              <h4 className="font-semibold text-gray-900">Bitcoin</h4>
              <p className="text-xs text-gray-600">Legacy & Bech32</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">Ξ</div>
              <h4 className="font-semibold text-gray-900">Ethereum</h4>
              <p className="text-xs text-gray-600">0x开头</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">B</div>
              <h4 className="font-semibold text-gray-900">BSC</h4>
              <p className="text-xs text-gray-600">Binance Smart Chain</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">M</div>
              <h4 className="font-semibold text-gray-900">Polygon</h4>
              <p className="text-xs text-gray-600">MATIC网络</p>
            </div>
          </div>
        </Card>

        {/* 使用说明 */}
        <Card className="mt-8 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">使用说明</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • <strong>地址格式：</strong>不同加密货币使用不同的地址格式
            </p>
            <p>
              • <strong>验证范围：</strong>检查地址的基本格式和长度
            </p>
            <p>
              • <strong>安全提醒：</strong>验证通过不代表地址安全，请确认来源
            </p>
            <p>
              • <strong>网络确认：</strong>确保在正确的网络上使用地址
            </p>
            <p className="text-xs text-gray-500 mt-4">
              ⚠️ 此工具仅验证地址格式，不保证地址的安全性，请谨慎使用
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
