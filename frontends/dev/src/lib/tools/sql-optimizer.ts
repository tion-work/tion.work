import { InputType, OutputType, ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class SQLOptimizerTool extends BaseTool {
  id = "sql-optimizer";
  name = "SQL Optimizer";
  description = "Analyze and optimize SQL queries";
  category: ToolCategory = "code";
  icon = "database";
  color = "bg-purple-500";
  inputType: InputType = "code";
  outputType: OutputType = "text";
  inputLanguage = "sql";
  inputPlaceholder = "Enter SQL query to optimize...";
  outputLanguage = "text";
  initialInput = "SELECT * FROM users WHERE age > 25 ORDER BY name";
  options = [
    {
      name: "addIndexes",
      label: "Suggest Indexes",
      type: "boolean" as const,
      defaultValue: true,
      description: "Suggest database indexes",
    },
    {
      name: "formatQuery",
      label: "Format Query",
      type: "boolean" as const,
      defaultValue: true,
      description: "Format the SQL query",
    },
    {
      name: "addComments",
      label: "Add Comments",
      type: "boolean" as const,
      defaultValue: false,
      description: "Add optimization comments",
    },
  ];

  getLocalizedContent(language: "zh" | "en" | "ja") {
    if (language === "en") {
      return {
        name: "SQL Optimizer",
        description: "Analyze and optimize SQL queries",
        inputPlaceholder: "Enter SQL query to optimize...",
        options: [
          {
            name: "addIndexes",
            label: "Suggest Indexes",
            type: "boolean",
            defaultValue: true,
            description: "Suggest database indexes",
          },
          {
            name: "formatQuery",
            label: "Format Query",
            type: "boolean",
            defaultValue: true,
            description: "Format the SQL query",
          },
          {
            name: "addComments",
            label: "Add Comments",
            type: "boolean",
            defaultValue: false,
            description: "Add optimization comments",
          },
        ],
      };
    }

    if (language === "ja") {
      return {
        name: "SQLオプティマイザー",
        description: "SQLクエリを分析・最適化",
        inputPlaceholder: "最適化するSQLクエリを入力してください...",
        options: this.options,
      };
    }

    return {
      name: "SQL 优化器",
      description: "分析和优化 SQL 查询",
      inputPlaceholder: "请输入要优化的 SQL 查询...",
      options: [
        {
          name: "addIndexes",
          label: "建议索引",
          type: "boolean",
          defaultValue: true,
          description: "建议数据库索引",
        },
        {
          name: "formatQuery",
          label: "格式化查询",
          type: "boolean",
          defaultValue: true,
          description: "格式化 SQL 查询",
        },
        {
          name: "addComments",
          label: "添加注释",
          type: "boolean",
          defaultValue: false,
          description: "添加优化注释",
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const {
      addIndexes = true,
      formatQuery = true,
      addComments = false,
    } = options;

    if (!input.trim()) {
      return "Please provide a SQL query to optimize.";
    }

    let result = input;
    let suggestions: string[] = [];

    // Format the query
    if (formatQuery) {
      result = this.formatSQL(input);
    }

    // Analyze the query for optimization opportunities
    const analysis = this.analyzeQuery(input);
    suggestions = analysis.suggestions;

    // Add index suggestions
    if (addIndexes && analysis.indexes.length > 0) {
      suggestions.push("--- Index Suggestions ---");
      suggestions.push(...analysis.indexes);
    }

    // Add optimization comments
    if (addComments) {
      result = this.addOptimizationComments(result, analysis);
    }

    let output = result;

    if (suggestions.length > 0) {
      output += "\n\n--- Optimization Suggestions ---\n";
      output += suggestions.join("\n");
    }

    return output;
  }

  private formatSQL(sql: string): string {
    // Simple SQL formatting
    let formatted = sql
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
      .replace(/\bUNION\b/gi, "\nUNION")
      .replace(/,/g, ",\n  ")
      .replace(/\n\s*\n/g, "\n")
      .trim();

    // Add proper indentation
    const lines = formatted.split("\n");
    let indented = "";
    let indentLevel = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (
        trimmed.match(/^(SELECT|FROM|WHERE|ORDER BY|GROUP BY|HAVING|UNION)/i)
      ) {
        indented += "  ".repeat(indentLevel) + trimmed + "\n";
        if (trimmed.match(/^(SELECT|FROM|WHERE|GROUP BY|HAVING|UNION)/i)) {
          indentLevel++;
        }
      } else if (trimmed.match(/^(JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN)/i)) {
        indented += "  ".repeat(indentLevel) + trimmed + "\n";
      } else {
        indented += "  ".repeat(indentLevel + 1) + trimmed + "\n";
      }
    }

    return indented.trim();
  }

  private analyzeQuery(sql: string): {
    suggestions: string[];
    indexes: string[];
  } {
    const suggestions: string[] = [];
    const indexes: string[] = [];
    const upperSQL = sql.toUpperCase();

    // Check for SELECT *
    if (upperSQL.includes("SELECT *")) {
      suggestions.push("• Avoid SELECT * - specify only needed columns");
    }

    // Check for missing WHERE clause
    if (
      upperSQL.includes("SELECT") &&
      !upperSQL.includes("WHERE") &&
      !upperSQL.includes("JOIN")
    ) {
      suggestions.push("• Consider adding WHERE clause to limit results");
    }

    // Check for ORDER BY without LIMIT
    if (upperSQL.includes("ORDER BY") && !upperSQL.includes("LIMIT")) {
      suggestions.push("• Consider adding LIMIT to ORDER BY queries");
    }

    // Check for LIKE patterns
    const likePatterns = sql.match(/LIKE\s+['"]([^'"]*)['"]/gi);
    if (likePatterns) {
      likePatterns.forEach((pattern) => {
        if (pattern.includes("%") && pattern.startsWith("%")) {
          suggestions.push(
            "• LIKE patterns starting with % cannot use indexes efficiently"
          );
        }
      });
    }

    // Suggest indexes for WHERE clauses
    const whereMatches = sql.match(/WHERE\s+(\w+)\s*[=<>]/gi);
    if (whereMatches) {
      whereMatches.forEach((match) => {
        const column = match.replace(/WHERE\s+(\w+)\s*[=<>].*/i, "$1");
        indexes.push(`CREATE INDEX idx_${column} ON table_name (${column});`);
      });
    }

    // Check for subqueries
    if (upperSQL.includes("(SELECT")) {
      suggestions.push(
        "• Consider using JOINs instead of subqueries for better performance"
      );
    }

    return { suggestions, indexes };
  }

  private addOptimizationComments(sql: string, analysis: any): string {
    let commented = sql;

    if (analysis.suggestions.length > 0) {
      commented = `-- Optimized SQL Query\n-- Suggestions: ${analysis.suggestions.length} optimization opportunities found\n\n${commented}`;
    }

    return commented;
  }

  validate(input: string): boolean {
    if (!input.trim()) {
      return true;
    }

    // Basic SQL validation
    const upperInput = input.toUpperCase();
    return (
      upperInput.includes("SELECT") ||
      upperInput.includes("INSERT") ||
      upperInput.includes("UPDATE") ||
      upperInput.includes("DELETE")
    );
  }
}
