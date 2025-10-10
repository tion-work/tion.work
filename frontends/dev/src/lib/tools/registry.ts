import { ToolRegistry } from './base';
import { JsonFormatterTool } from './json-formatter';
import { Base64EncoderTool } from './base64-encoder';
import { PasswordGeneratorTool } from './password-generator';
import { TimestampConverterTool } from './timestamp-converter';
import { QrCodeGeneratorTool } from './qr-code-generator';
import { UrlEncoderTool } from './url-encoder';
import { HashGeneratorTool } from './hash-generator';
import { JavaScriptFormatterTool } from './javascript-formatter';
import { CSSMinifierTool } from './css-minifier';
import { HTMLMinifierTool } from './html-minifier';
import { MarkdownConverterTool } from './markdown-converter';
import { PythonFormatterTool } from './python-formatter';
import { XMLFormatterTool } from './xml-formatter';
import { SQLFormatterTool } from './sql-formatter';
import { YAMLConverterTool } from './yaml-converter';
import { CSVConverterTool } from './csv-converter';
import { RegexTesterTool } from './regex-tester';
import { ColorPickerTool } from './color-picker';
import { JWTDecoderTool } from './jwt-decoder';
import { URLShortenerTool } from './url-shortener';
import { TextDiffTool } from './text-diff';
import { UUIDGeneratorTool } from './uuid-generator';
import { LoremGeneratorTool } from './lorem-generator';
import { JSONValidatorTool } from './json-validator';
import { XMLValidatorTool } from './xml-validator';
import { SQLOptimizerTool } from './sql-optimizer';
import { RandomDataGeneratorTool } from './random-data-generator';
import { FileSizeCalculatorTool } from './file-size-calculator';
import { TimeCalculatorTool } from './time-calculator';
import { URLAnalyzerTool } from './url-analyzer';

// 注册所有工具
export function registerTools() {
  // 代码工具
  ToolRegistry.register(new JsonFormatterTool());
  ToolRegistry.register(new JavaScriptFormatterTool());
  ToolRegistry.register(new PythonFormatterTool());
  ToolRegistry.register(new XMLFormatterTool());
  ToolRegistry.register(new SQLFormatterTool());
  ToolRegistry.register(new CSSMinifierTool());
  ToolRegistry.register(new HTMLMinifierTool());
  ToolRegistry.register(new JSONValidatorTool());
  ToolRegistry.register(new XMLValidatorTool());
  ToolRegistry.register(new SQLOptimizerTool());
  
  // 数据处理工具
  ToolRegistry.register(new Base64EncoderTool());
  ToolRegistry.register(new TimestampConverterTool());
  ToolRegistry.register(new UrlEncoderTool());
  ToolRegistry.register(new YAMLConverterTool());
  ToolRegistry.register(new CSVConverterTool());
  ToolRegistry.register(new RegexTesterTool());
  
  // 安全工具
  ToolRegistry.register(new PasswordGeneratorTool());
  ToolRegistry.register(new HashGeneratorTool());
  ToolRegistry.register(new JWTDecoderTool());
  
  // 设计工具
  ToolRegistry.register(new ColorPickerTool());
  
  // 实用工具
  ToolRegistry.register(new QrCodeGeneratorTool());
  ToolRegistry.register(new URLShortenerTool());
  
  // 文本工具
  ToolRegistry.register(new MarkdownConverterTool());
  ToolRegistry.register(new TextDiffTool());
  ToolRegistry.register(new LoremGeneratorTool());
  
  // 实用工具
  ToolRegistry.register(new UUIDGeneratorTool());
  ToolRegistry.register(new RandomDataGeneratorTool());
  ToolRegistry.register(new FileSizeCalculatorTool());
  ToolRegistry.register(new TimeCalculatorTool());
  ToolRegistry.register(new URLAnalyzerTool());
  
  // 可以在这里添加更多工具...
}

// 导出工具注册函数
export { ToolRegistry };
export * from './base';
export * from './json-formatter';
export * from './base64-encoder';
export * from './password-generator';
export * from './timestamp-converter';
export * from './qr-code-generator';
export * from './url-encoder';
export * from './hash-generator';
export * from './javascript-formatter';
export * from './css-minifier';
export * from './html-minifier';
export * from './markdown-converter';
export * from './python-formatter';
export * from './xml-formatter';
export * from './sql-formatter';
export * from './yaml-converter';
export * from './csv-converter';
export * from './regex-tester';
export * from './color-picker';
export * from './jwt-decoder';
export * from './url-shortener';
export * from './text-diff';
export * from './uuid-generator';
export * from './lorem-generator';
export * from './json-validator';
export * from './xml-validator';
export * from './sql-optimizer';
export * from './random-data-generator';
export * from './file-size-calculator';
export * from './time-calculator';
export * from './url-analyzer';
