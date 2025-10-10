import { BaseTool } from './base';
import { ToolCategory } from '../../types';

export class SQLOptimizerTool extends BaseTool {
  id = 'sql-optimizer';
  name = 'SQL 查询优化器';
  description = '分析和优化 SQL 查询，提供性能改进建议。';
  category: ToolCategory = 'code';
  icon = 'Zap';
  slug = 'sql-optimizer';

  options = [
    {
      key: 'database',
      label: '数据库类型',
      type: 'select',
      defaultValue: 'mysql',
      description: '选择目标数据库类型',
      options: [
        { value: 'mysql', label: 'MySQL' },
        { value: 'postgresql', label: 'PostgreSQL' },
        { value: 'sqlite', label: 'SQLite' },
        { value: 'oracle', label: 'Oracle' },
        { value: 'sqlserver', label: 'SQL Server' }
      ]
    },
    {
      key: 'checkIndexes',
      label: '检查索引建议',
      type: 'boolean',
      defaultValue: true,
      description: '是否提供索引优化建议'
    },
    {
      key: 'checkJoins',
      label: '检查连接优化',
      type: 'boolean',
      defaultValue: true,
      description: '是否检查 JOIN 语句优化'
    }
  ];

  async process(input: string, options?: Record<string, any>): Promise<string> {
    const { database = 'mysql', checkIndexes = true, checkJoins = true } = options || {};
    
    try {
      if (!input.trim()) {
        return JSON.stringify({
          valid: false,
          error: '输入为空',
          message: '请输入要优化的 SQL 查询'
        }, null, 2);
      }

      const analysis = this.analyzeSQL(input, database);
      const suggestions = this.generateSuggestions(input, analysis, { checkIndexes, checkJoins });
      const optimized = this.optimizeSQL(input, suggestions);

      return JSON.stringify({
        original: input,
        analysis: analysis,
        suggestions: suggestions,
        optimized: optimized,
        summary: this.generateSummary(analysis, suggestions)
      }, null, 2);
    } catch (error: any) {
      throw new Error(`SQL 优化失败: ${error.message}`);
    }
  }

  private analyzeSQL(sql: string, database: string): any {
    const analysis = {
      database: database,
      queryType: this.getQueryType(sql),
      tables: this.extractTables(sql),
      joins: this.extractJoins(sql),
      whereClauses: this.extractWhereClauses(sql),
      orderBy: this.extractOrderBy(sql),
      groupBy: this.extractGroupBy(sql),
      hasLimit: this.hasLimit(sql),
      hasDistinct: this.hasDistinct(sql),
      complexity: this.calculateComplexity(sql)
    };

    return analysis;
  }

  private getQueryType(sql: string): string {
    const upperSQL = sql.toUpperCase().trim();
    if (upperSQL.startsWith('SELECT')) return 'SELECT';
    if (upperSQL.startsWith('INSERT')) return 'INSERT';
    if (upperSQL.startsWith('UPDATE')) return 'UPDATE';
    if (upperSQL.startsWith('DELETE')) return 'DELETE';
    if (upperSQL.startsWith('CREATE')) return 'CREATE';
    if (upperSQL.startsWith('ALTER')) return 'ALTER';
    if (upperSQL.startsWith('DROP')) return 'DROP';
    return 'UNKNOWN';
  }

  private extractTables(sql: string): string[] {
    const tables: string[] = [];
    const fromMatch = sql.match(/FROM\s+([^\s,]+)/gi);
    const joinMatch = sql.match(/JOIN\s+([^\s,]+)/gi);
    
    if (fromMatch) {
      fromMatch.forEach(match => {
        const table = match.replace(/FROM\s+/i, '').trim();
        if (table && !tables.includes(table)) {
          tables.push(table);
        }
      });
    }
    
    if (joinMatch) {
      joinMatch.forEach(match => {
        const table = match.replace(/JOIN\s+/i, '').trim();
        if (table && !tables.includes(table)) {
          tables.push(table);
        }
      });
    }
    
    return tables;
  }

  private extractJoins(sql: string): any[] {
    const joins: any[] = [];
    const joinRegex = /(INNER|LEFT|RIGHT|FULL)?\s*JOIN\s+([^\s]+)\s+ON\s+([^WHERE\s]+)/gi;
    let match;
    
    while ((match = joinRegex.exec(sql)) !== null) {
      joins.push({
        type: match[1] || 'INNER',
        table: match[2],
        condition: match[3].trim()
      });
    }
    
    return joins;
  }

  private extractWhereClauses(sql: string): string[] {
    const whereMatch = sql.match(/WHERE\s+([\s\S]+?)(?=GROUP\s+BY|ORDER\s+BY|LIMIT|$)/i);
    if (!whereMatch) return [];
    
    return whereMatch[1].split(/\s+AND\s+|\s+OR\s+/i).map(clause => clause.trim());
  }

  private extractOrderBy(sql: string): string[] {
    const orderMatch = sql.match(/ORDER\s+BY\s+([\s\S]+?)(?=LIMIT|$)/i);
    if (!orderMatch) return [];
    
    return orderMatch[1].split(',').map(column => column.trim());
  }

  private extractGroupBy(sql: string): string[] {
    const groupMatch = sql.match(/GROUP\s+BY\s+(.+?)(?=HAVING|ORDER\s+BY|LIMIT|$)/i);
    if (!groupMatch) return [];
    
    return groupMatch[1].split(',').map(column => column.trim());
  }

  private hasLimit(sql: string): boolean {
    return /LIMIT\s+\d+/i.test(sql);
  }

  private hasDistinct(sql: string): boolean {
    return /SELECT\s+DISTINCT/i.test(sql);
  }

  private calculateComplexity(sql: string): number {
    let complexity = 1;
    complexity += (sql.match(/JOIN/gi) || []).length;
    complexity += (sql.match(/UNION/gi) || []).length;
    complexity += (sql.match(/SUBQUERY/gi) || []).length;
    complexity += (sql.match(/CASE/gi) || []).length;
    return complexity;
  }

  private generateSuggestions(sql: string, analysis: any, options: any): any[] {
    const suggestions: any[] = [];
    
    // 索引建议
    if (options.checkIndexes) {
      analysis.whereClauses.forEach((clause: string) => {
        if (clause.includes('=') || clause.includes('LIKE')) {
          const column = this.extractColumnFromClause(clause);
          if (column) {
            suggestions.push({
              type: 'index',
              priority: 'high',
              message: `考虑为列 '${column}' 创建索引`,
              sql: `CREATE INDEX idx_${column.replace('.', '_')} ON ${analysis.tables[0]} (${column});`
            });
          }
        }
      });
    }
    
    // JOIN 优化建议
    if (options.checkJoins && analysis.joins.length > 0) {
      analysis.joins.forEach((join: any) => {
        if (join.condition.includes('=')) {
          const columns = join.condition.split('=').map((col: string) => col.trim());
          suggestions.push({
            type: 'join',
            priority: 'medium',
            message: `确保 JOIN 条件中的列 '${columns[0]}' 和 '${columns[1]}' 都有索引`,
            sql: `-- 检查索引: ${columns.join(' 和 ')}`
          });
        }
      });
    }
    
    // 其他优化建议
    if (!analysis.hasLimit && analysis.queryType === 'SELECT') {
      suggestions.push({
        type: 'performance',
        priority: 'medium',
        message: '考虑添加 LIMIT 子句限制结果集大小',
        sql: '-- 添加 LIMIT 子句'
      });
    }
    
    if (analysis.hasDistinct) {
      suggestions.push({
        type: 'performance',
        priority: 'low',
        message: 'DISTINCT 可能影响性能，考虑是否真的需要',
        sql: '-- 评估是否真的需要 DISTINCT'
      });
    }
    
    return suggestions;
  }

  private extractColumnFromClause(clause: string): string | null {
    const match = clause.match(/(\w+\.\w+|\w+)\s*[=<>]/);
    return match ? match[1] : null;
  }

  private optimizeSQL(sql: string, suggestions: any[]): string {
    let optimized = sql;
    
    // 这里可以实现具体的 SQL 优化逻辑
    // 例如：添加索引提示、重写查询等
    
    return optimized;
  }

  private generateSummary(analysis: any, suggestions: any[]): any {
    return {
      queryType: analysis.queryType,
      complexity: analysis.complexity,
      tablesInvolved: analysis.tables.length,
      suggestionsCount: suggestions.length,
      highPriorityIssues: suggestions.filter(s => s.priority === 'high').length,
      mediumPriorityIssues: suggestions.filter(s => s.priority === 'medium').length,
      lowPriorityIssues: suggestions.filter(s => s.priority === 'low').length
    };
  }

  validate(input: string): boolean {
    return typeof input === 'string' && input.trim().length > 0;
  }
}
