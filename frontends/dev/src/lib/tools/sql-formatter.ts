import { InputType, OutputType, ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class SQLFormatterTool extends BaseTool {
  id = "sql-formatter";
  name = "SQL Formatter";
  description = "Format and beautify SQL queries";
  category: ToolCategory = "code";
  icon = "database";
  color = "bg-purple-500";
  inputType: InputType = "code";
  outputType: OutputType = "code";
  inputLanguage = "sql";
  inputPlaceholder = "Enter SQL query to format...";
  outputLanguage = "sql";
  initialInput = "SELECT * FROM users WHERE age > 25 ORDER BY name";
  options = [
    {
      name: "indent",
      label: "Indent",
      type: "number" as const,
      defaultValue: 2,
      description: "Number of spaces for indentation",
    },
    {
      name: "uppercase",
      label: "Uppercase Keywords",
      type: "boolean" as const,
      defaultValue: true,
      description: "Convert SQL keywords to uppercase",
    },
    {
      name: "alignCommas",
      label: "Align Commas",
      type: "boolean" as const,
      defaultValue: false,
      description: "Align commas in column lists",
    },
  ];

  getLocalizedContent(language: "zh" | "en" | "ja") {
    if (language === "en") {
      return {
        name: "SQL Formatter",
        description: "Format and beautify SQL queries",
        inputPlaceholder: "Enter SQL query to format...",
        options: [
          {
            name: "indent",
            label: "Indent",
            type: "number",
            defaultValue: 2,
            description: "Number of spaces for indentation",
          },
          {
            name: "uppercase",
            label: "Uppercase Keywords",
            type: "boolean",
            defaultValue: true,
            description: "Convert SQL keywords to uppercase",
          },
          {
            name: "alignCommas",
            label: "Align Commas",
            type: "boolean",
            defaultValue: false,
            description: "Align commas in column lists",
          },
        ],
      };
    }

    if (language === "ja") {
      return {
        name: "SQLフォーマッター",
        description: "SQLクエリをフォーマット・美化",
        inputPlaceholder: "フォーマットするSQLクエリを入力してください...",
        options: [
          {
            name: "indent",
            label: "インデント",
            type: "number",
            defaultValue: 2,
            description: "インデントのスペース数",
          },
          {
            name: "uppercase",
            label: "キーワードを大文字に",
            type: "boolean",
            defaultValue: true,
            description: "SQLキーワードを大文字に変換",
          },
          {
            name: "alignCommas",
            label: "カンマを揃える",
            type: "boolean",
            defaultValue: false,
            description: "カラムリストでカンマを揃える",
          },
        ],
      };
    }

    return {
      name: "SQL 格式化器",
      description: "格式化和美化 SQL 查询",
      inputPlaceholder: "请输入要格式化的 SQL 查询...",
      options: [
        {
          name: "indent",
          label: "缩进",
          type: "number",
          defaultValue: 2,
          description: "缩进空格数",
        },
        {
          name: "uppercase",
          label: "大写关键字",
          type: "boolean",
          defaultValue: true,
          description: "将 SQL 关键字转换为大写",
        },
        {
          name: "alignCommas",
          label: "对齐逗号",
          type: "boolean",
          defaultValue: false,
          description: "在列列表中对齐逗号",
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const { indent = 2, uppercase = true, alignCommas = false } = options;

    if (!input.trim()) {
      return "";
    }

    let formatted = input.trim();

    // Convert to uppercase if requested
    if (uppercase) {
      formatted = this.uppercaseKeywords(formatted);
    }

    // Basic SQL formatting
    formatted = this.formatSQL(formatted, indent, alignCommas);

    return formatted;
  }

  private uppercaseKeywords(sql: string): string {
    const keywords = [
      "SELECT",
      "FROM",
      "WHERE",
      "ORDER BY",
      "GROUP BY",
      "HAVING",
      "JOIN",
      "LEFT JOIN",
      "RIGHT JOIN",
      "INNER JOIN",
      "OUTER JOIN",
      "UNION",
      "INSERT",
      "UPDATE",
      "DELETE",
      "CREATE",
      "ALTER",
      "DROP",
      "TABLE",
      "INDEX",
      "VIEW",
      "DATABASE",
      "SCHEMA",
      "AS",
      "ON",
      "IN",
      "EXISTS",
      "BETWEEN",
      "LIKE",
      "IS NULL",
      "IS NOT NULL",
      "AND",
      "OR",
      "NOT",
      "INTO",
      "VALUES",
      "SET",
      "DEFAULT",
      "PRIMARY KEY",
      "FOREIGN KEY",
      "REFERENCES",
      "CONSTRAINT",
      "UNIQUE",
      "CHECK",
      "DISTINCT",
      "ALL",
      "ANY",
      "SOME",
      "CASE",
      "WHEN",
      "THEN",
      "ELSE",
      "END",
      "IF",
      "WHILE",
      "FOR",
      "LOOP",
      "BEGIN",
      "COMMIT",
      "ROLLBACK",
      "TRANSACTION",
      "GRANT",
      "REVOKE",
      "DENY",
      "EXEC",
      "EXECUTE",
      "DECLARE",
      "CURSOR",
      "FETCH",
      "OPEN",
      "CLOSE",
      "DEALLOCATE",
      "PRINT",
      "RAISERROR",
      "RETURN",
      "GOTO",
      "WAITFOR",
      "BREAK",
      "CONTINUE",
    ];

    let result = sql;
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      result = result.replace(regex, keyword);
    });

    return result;
  }

  private formatSQL(sql: string, indent: number, alignCommas: boolean): string {
    const spaces = " ".repeat(indent);
    let formatted = sql;

    // Add line breaks after major keywords
    formatted = formatted
      .replace(/\bSELECT\b/gi, "\nSELECT")
      .replace(/\bFROM\b/gi, "\nFROM")
      .replace(/\bWHERE\b/gi, "\nWHERE")
      .replace(/\bORDER BY\b/gi, "\nORDER BY")
      .replace(/\bGROUP BY\b/gi, "\nGROUP BY")
      .replace(/\bHAVING\b/gi, "\nHAVING")
      .replace(/\bJOIN\b/gi, "\nJOIN")
      .replace(/\bLEFT JOIN\b/gi, "\nLEFT JOIN")
      .replace(/\bRIGHT JOIN\b/gi, "\nRIGHT JOIN")
      .replace(/\bINNER JOIN\b/gi, "\nINNER JOIN")
      .replace(/\bOUTER JOIN\b/gi, "\nOUTER JOIN")
      .replace(/\bUNION\b/gi, "\nUNION")
      .replace(/\bINSERT\b/gi, "\nINSERT")
      .replace(/\bUPDATE\b/gi, "\nUPDATE")
      .replace(/\bDELETE\b/gi, "\nDELETE")
      .replace(/\bCREATE\b/gi, "\nCREATE")
      .replace(/\bALTER\b/gi, "\nALTER")
      .replace(/\bDROP\b/gi, "\nDROP");

    // Add line breaks before AND/OR in WHERE clauses
    formatted = formatted.replace(/\b(AND|OR)\b/gi, "\n$1");

    // Handle commas in SELECT statements
    if (alignCommas) {
      formatted = this.alignCommas(formatted, spaces);
    } else {
      formatted = formatted.replace(/,/g, ",\n  ");
    }

    // Clean up extra whitespace and add proper indentation
    const lines = formatted
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    let result = "";
    let indentLevel = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) continue;

      // Decrease indent level for certain keywords
      if (
        trimmed.match(
          /^(FROM|WHERE|ORDER BY|GROUP BY|HAVING|UNION|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)/i
        )
      ) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Add the line with proper indentation
      result += spaces.repeat(indentLevel) + trimmed + "\n";

      // Increase indent level for certain keywords
      if (trimmed.match(/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)/i)) {
        indentLevel++;
      }
    }

    return result.trim();
  }

  private alignCommas(sql: string, spaces: string): string {
    // Simple comma alignment - this is a basic implementation
    return sql.replace(/,/g, ",\n  ");
  }

  validate(input: string): boolean {
    if (!input.trim()) {
      return true;
    }

    // Basic SQL validation - check for common SQL keywords
    const upperInput = input.toUpperCase();
    return (
      upperInput.includes("SELECT") ||
      upperInput.includes("INSERT") ||
      upperInput.includes("UPDATE") ||
      upperInput.includes("DELETE") ||
      upperInput.includes("CREATE") ||
      upperInput.includes("ALTER") ||
      upperInput.includes("DROP")
    );
  }
}
