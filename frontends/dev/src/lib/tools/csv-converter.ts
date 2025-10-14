import { InputType, OutputType, ToolCategory } from "../../types";
import { BaseTool } from "./base";

export class CSVConverterTool extends BaseTool {
  id = "csv-converter";
  name = "CSV 转换器";
  description = "JSON 与 CSV 格式相互转换";
  category: ToolCategory = "data";
  icon = "file-text";
  color = "bg-blue-500";
  inputType: InputType = "textarea";
  outputType: OutputType = "text";
  inputLanguage = undefined;
  inputPlaceholder = "请输入 JSON 或 CSV 数据...";
  outputLanguage = undefined;
  initialInput = '[{"name":"John","age":30},{"name":"Jane","age":25}]';
  options = [];

  getLocalizedContent(language: "zh" | "en" | "ja") {
    if (language === "en") {
      return {
        name: "CSV Converter",
        description: "Convert between JSON and CSV formats",
        inputPlaceholder: "Please enter JSON data...",
        options: [],
      };
    }

    if (language === "ja") {
      return {
        name: "CSVコンバーター",
        description: "JSONとCSV形式の相互変換",
        inputPlaceholder: "JSONまたはCSVデータを入力してください...",
        options: [],
      };
    }

    return {
      name: "CSV 转换器",
      description: "JSON 与 CSV 格式相互转换",
      inputPlaceholder: "请输入 JSON 数据...",
      options: [],
    };
  }

  async process(input: string, options: any = {}): Promise<string> {
    const {
      direction = "json-to-csv",
      delimiter = ",",
      includeHeaders = true,
      quoteChar = '"',
    } = options;

    try {
      if (direction === "json-to-csv") {
        return this.jsonToCsv(input, { delimiter, includeHeaders, quoteChar });
      } else {
        return this.csvToJson(input, { delimiter, quoteChar });
      }
    } catch (error) {
      throw new Error(
        `CSV 转换失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    }
  }

  validate(input: string): boolean {
    try {
      if (input.trim().startsWith("{") || input.trim().startsWith("[")) {
        JSON.parse(input);
        return true;
      } else {
        return input.trim().length > 0;
      }
    } catch {
      return false;
    }
  }

  private jsonToCsv(json: string, options: any): string {
    const data = JSON.parse(json);
    const array = Array.isArray(data) ? data : [data];

    if (array.length === 0) return "";

    const headers = Object.keys(array[0]);
    let csv = "";

    if (options.includeHeaders) {
      csv +=
        headers
          .map((h) => this.escapeCsvValue(h, options.quoteChar))
          .join(options.delimiter) + "\n";
    }

    for (const row of array) {
      const values = headers.map((h) =>
        this.escapeCsvValue(row[h] || "", options.quoteChar)
      );
      csv += values.join(options.delimiter) + "\n";
    }

    return csv.trim();
  }

  private csvToJson(csv: string, options: any): string {
    const lines = csv.trim().split("\n");
    if (lines.length === 0) return "[]";

    const headers = lines[0]
      .split(options.delimiter)
      .map((h) => h.trim().replace(/^"|"$/g, ""));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(
        lines[i],
        options.delimiter,
        options.quoteChar
      );
      const row: any = {};

      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = values[j] || "";
      }

      result.push(row);
    }

    return JSON.stringify(result, null, 2);
  }

  private escapeCsvValue(value: any, quoteChar: string): string {
    const str = String(value || "");
    if (str.includes(",") || str.includes("\n") || str.includes('"')) {
      return `${quoteChar}${str.replace(/"/g, '""')}${quoteChar}`;
    }
    return str;
  }

  private parseCsvLine(
    line: string,
    delimiter: string,
    quoteChar: string
  ): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === quoteChar) {
        if (inQuotes && line[i + 1] === quoteChar) {
          current += quoteChar;
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }
}
