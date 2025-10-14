import { ToolRegistry } from "./base";
import { Base64EncoderTool } from "./base64-encoder";
import { ColorPickerTool } from "./color-picker";
import { CSVConverterTool } from "./csv-converter";
import { FileSizeCalculatorTool } from "./file-size-calculator";
import { JsonFormatterTool } from "./json-formatter";
import { JSONValidatorTool } from "./json-validator";
import { JWTDecoderTool } from "./jwt-decoder";
import { LoremGeneratorTool } from "./lorem-generator";
import { MarkdownConverterTool } from "./markdown-converter";
import { PasswordGeneratorTool } from "./password-generator";
import { PythonFormatterTool } from "./python-formatter";
import { QrCodeGeneratorTool } from "./qr-code-generator";
import { RandomDataGeneratorTool } from "./random-data-generator";
import { RegexTesterTool } from "./regex-tester";
import { SQLFormatterTool } from "./sql-formatter";
import { SQLOptimizerTool } from "./sql-optimizer";
import { TextDiffTool } from "./text-diff";
import { TimeCalculatorTool } from "./time-calculator";
import { TimestampConverterTool } from "./timestamp-converter";
import { URLAnalyzerTool } from "./url-analyzer";
import { URLShortenerTool } from "./url-shortener";
import { UUIDGeneratorTool } from "./uuid-generator";
import { XMLFormatterTool } from "./xml-formatter";
import { XMLValidatorTool } from "./xml-validator";
import { YAMLConverterTool } from "./yaml-converter";

// 注册所有工具
export function registerTools() {
  // 核心工具
  ToolRegistry.register(new JsonFormatterTool());
  ToolRegistry.register(new Base64EncoderTool());
  ToolRegistry.register(new PasswordGeneratorTool());
  ToolRegistry.register(new TimestampConverterTool());
  ToolRegistry.register(new QrCodeGeneratorTool());

  // 代码处理工具
  ToolRegistry.register(new MarkdownConverterTool());
  ToolRegistry.register(new PythonFormatterTool());
  ToolRegistry.register(new XMLFormatterTool());
  ToolRegistry.register(new SQLFormatterTool());
  ToolRegistry.register(new JSONValidatorTool());
  ToolRegistry.register(new XMLValidatorTool());
  ToolRegistry.register(new SQLOptimizerTool());

  // 数据处理工具
  ToolRegistry.register(new YAMLConverterTool());
  ToolRegistry.register(new CSVConverterTool());

  // 文本工具
  ToolRegistry.register(new TextDiffTool());
  ToolRegistry.register(new LoremGeneratorTool());

  // 实用工具
  ToolRegistry.register(new RegexTesterTool());
  ToolRegistry.register(new ColorPickerTool());
  ToolRegistry.register(new JWTDecoderTool());
  ToolRegistry.register(new URLShortenerTool());
  ToolRegistry.register(new UUIDGeneratorTool());
  ToolRegistry.register(new RandomDataGeneratorTool());
  ToolRegistry.register(new FileSizeCalculatorTool());
  ToolRegistry.register(new TimeCalculatorTool());
  ToolRegistry.register(new URLAnalyzerTool());
}

// 导出工具注册函数
export * from "./base";
export * from "./base64-encoder";
export * from "./color-picker";
export * from "./css-minifier";
export * from "./csv-converter";
export * from "./file-size-calculator";
export * from "./hash-generator";
export * from "./html-minifier";
export * from "./javascript-formatter";
export * from "./json-formatter";
export * from "./json-validator";
export * from "./jwt-decoder";
export * from "./lorem-generator";
export * from "./markdown-converter";
export * from "./password-generator";
export * from "./python-formatter";
export * from "./qr-code-generator";
export * from "./random-data-generator";
export * from "./regex-tester";
export * from "./sql-formatter";
export * from "./sql-optimizer";
export * from "./text-diff";
export * from "./time-calculator";
export * from "./timestamp-converter";
export * from "./url-analyzer";
export * from "./url-encoder";
export * from "./url-shortener";
export * from "./uuid-generator";
export * from "./xml-formatter";
export * from "./xml-validator";
export * from "./yaml-converter";
export { ToolRegistry };
