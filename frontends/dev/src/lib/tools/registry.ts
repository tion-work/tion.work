import { ToolRegistry } from "./base";
import { Base64EncoderTool } from "./base64-encoder";
import { JsonFormatterTool } from "./json-formatter";
import { PasswordGeneratorTool } from "./password-generator";
import { QrCodeGeneratorTool } from "./qr-code-generator";
import { TimestampConverterTool } from "./timestamp-converter";
// import { MarkdownConverterTool } from './markdown-converter';
// import { PythonFormatterTool } from './python-formatter';
// import { XMLFormatterTool } from './xml-formatter';
// import { SQLFormatterTool } from './sql-formatter';
// import { YAMLConverterTool } from './yaml-converter';
// import { CSVConverterTool } from './csv-converter';
// import { RegexTesterTool } from './regex-tester';
// import { ColorPickerTool } from './color-picker';
// import { JWTDecoderTool } from './jwt-decoder';
// import { URLShortenerTool } from './url-shortener';
// import { TextDiffTool } from './text-diff';
// import { UUIDGeneratorTool } from './uuid-generator';
// import { LoremGeneratorTool } from './lorem-generator';
// import { JSONValidatorTool } from './json-validator';
// import { XMLValidatorTool } from './xml-validator';
// import { SQLOptimizerTool } from './sql-optimizer';
// import { RandomDataGeneratorTool } from './random-data-generator';
// import { FileSizeCalculatorTool } from './file-size-calculator';
// import { TimeCalculatorTool } from './time-calculator';
// import { URLAnalyzerTool } from './url-analyzer';

// 注册所有工具
export function registerTools() {
  // 核心工具
  ToolRegistry.register(new JsonFormatterTool());
  ToolRegistry.register(new Base64EncoderTool());
  ToolRegistry.register(new PasswordGeneratorTool());
  ToolRegistry.register(new TimestampConverterTool());
  ToolRegistry.register(new QrCodeGeneratorTool());

  // 可以在这里添加更多工具...
}

// 导出工具注册函数
export * from "./base";
export * from "./base64-encoder";
export * from "./css-minifier";
export * from "./hash-generator";
export * from "./html-minifier";
export * from "./javascript-formatter";
export * from "./json-formatter";
export * from "./password-generator";
export * from "./qr-code-generator";
export * from "./timestamp-converter";
export * from "./url-encoder";
export { ToolRegistry };
// export * from './markdown-converter';
// export * from './python-formatter';
// export * from './xml-formatter';
// export * from './sql-formatter';
// export * from './yaml-converter';
// export * from './csv-converter';
// export * from './regex-tester';
// export * from './color-picker';
// export * from './jwt-decoder';
// export * from './url-shortener';
// export * from './text-diff';
// export * from './uuid-generator';
// export * from './lorem-generator';
// export * from './json-validator';
// export * from './xml-validator';
// export * from './sql-optimizer';
// export * from './random-data-generator';
// export * from './file-size-calculator';
// export * from './time-calculator';
// export * from './url-analyzer';
