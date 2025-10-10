import { BaseTool } from './base';
import { ToolCategory } from '../../types';

export class YAMLConverterTool extends BaseTool {
  id = 'yaml-converter';
  name = 'YAML 转换器';
  description = 'JSON 与 YAML 格式相互转换';
  category: ToolCategory = 'data';
  icon = 'file-text';
  options = [];

  async process(input: string, options: any = {}): Promise<string> {
    const {
      direction = 'json-to-yaml',
      indentSize = 2,
      sortKeys = false
    } = options;

    try {
      if (direction === 'json-to-yaml') {
        return this.jsonToYaml(input, { indentSize, sortKeys });
      } else {
        return this.yamlToJson(input, { sortKeys });
      }
    } catch (error) {
      throw new Error(`YAML 转换失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  validate(input: string): boolean {
    try {
      if (input.trim().startsWith('{') || input.trim().startsWith('[')) {
        JSON.parse(input);
        return true;
      } else {
        // 简单的 YAML 验证
        return input.trim().length > 0;
      }
    } catch {
      return false;
    }
  }

  private jsonToYaml(json: string, options: any): string {
    const obj = JSON.parse(json);
    return this.objectToYaml(obj, options.indentSize, 0);
  }

  private yamlToJson(yaml: string, options: any): string {
    // 简化的 YAML 到 JSON 转换
    const lines = yaml.split('\n');
    const result: any = {};
    let currentPath: string[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      
      const match = trimmed.match(/^(\s*)([^:]+):\s*(.*)$/);
      if (match) {
        const [, indent, key, value] = match;
        const level = indent.length / 2;
        
        // 调整路径
        currentPath = currentPath.slice(0, level);
        currentPath.push(key.trim());
        
        if (value.trim()) {
          // 设置值
          let current = result;
          for (let i = 0; i < currentPath.length - 1; i++) {
            if (!current[currentPath[i]]) {
              current[currentPath[i]] = {};
            }
            current = current[currentPath[i]];
          }
          current[currentPath[currentPath.length - 1]] = this.parseValue(value.trim());
        }
      }
    });
    
    return JSON.stringify(result, null, 2);
  }

  private objectToYaml(obj: any, indentSize: number, level: number): string {
    const indent = ' '.repeat(level * indentSize);
    let yaml = '';
    
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          yaml += indent + '-\n';
          yaml += this.objectToYaml(item, indentSize, level + 1);
        } else {
          yaml += indent + '- ' + this.stringifyValue(item) + '\n';
        }
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          yaml += indent + key + ':\n';
          yaml += this.objectToYaml(value, indentSize, level + 1);
        } else {
          yaml += indent + key + ': ' + this.stringifyValue(value) + '\n';
        }
      });
    }
    
    return yaml;
  }

  private parseValue(value: string): any {
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value === 'null') return null;
    if (!isNaN(Number(value))) return Number(value);
    return value;
  }

  private stringifyValue(value: any): string {
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    return String(value);
  }
}
