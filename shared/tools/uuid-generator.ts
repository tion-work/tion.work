import { BaseTool } from './base';

export class UUIDGeneratorTool extends BaseTool {
  id = 'uuid-generator';
  name = 'UUID 生成器';
  description = '生成各种版本的 UUID（通用唯一标识符）。';
  category = 'utility';
  icon = 'Hash';
  slug = 'uuid-generator';

  options = [
    {
      key: 'version',
      label: 'UUID 版本',
      type: 'select',
      defaultValue: 'v4',
      description: '选择要生成的 UUID 版本',
      options: [
        { value: 'v1', label: 'v1 - 基于时间戳' },
        { value: 'v4', label: 'v4 - 随机生成' },
        { value: 'v5', label: 'v5 - 基于命名空间' }
      ]
    },
    {
      key: 'count',
      label: '生成数量',
      type: 'number',
      defaultValue: 1,
      description: '要生成的 UUID 数量（1-100）'
    },
    {
      key: 'namespace',
      label: '命名空间（v5）',
      type: 'text',
      defaultValue: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      description: 'v5 UUID 的命名空间（可选）'
    },
    {
      key: 'name',
      label: '名称（v5）',
      type: 'text',
      defaultValue: 'example',
      description: 'v5 UUID 的名称（可选）'
    }
  ];

  async process(input: string, options?: Record<string, any>): Promise<string> {
    const { version = 'v4', count = 1, namespace, name } = options || {};
    const numCount = Math.min(Math.max(parseInt(count) || 1, 1), 100);
    
    try {
      const uuids: string[] = [];
      
      for (let i = 0; i < numCount; i++) {
        let uuid: string;
        
        switch (version) {
          case 'v1':
            uuid = this.generateUUIDv1();
            break;
          case 'v4':
            uuid = this.generateUUIDv4();
            break;
          case 'v5':
            if (!namespace || !name) {
              throw new Error('v5 UUID 需要提供命名空间和名称');
            }
            uuid = this.generateUUIDv5(name, namespace);
            break;
          default:
            uuid = this.generateUUIDv4();
        }
        
        uuids.push(uuid);
      }
      
      return uuids.join('\n');
    } catch (error: any) {
      throw new Error(`UUID 生成失败: ${error.message}`);
    }
  }

  private generateUUIDv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private generateUUIDv1(): string {
    // 简化的 v1 UUID 生成（基于时间戳）
    const timestamp = Date.now();
    const random = Math.random().toString(16).substring(2, 14);
    return `${timestamp.toString(16).padStart(8, '0')}-${random.substring(0, 4)}-1${random.substring(4, 7)}-${random.substring(7, 11)}-${random.substring(11)}`;
  }

  private generateUUIDv5(name: string, namespace: string): string {
    // 简化的 v5 UUID 生成（基于命名空间和名称的哈希）
    const input = namespace + name;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为 32 位整数
    }
    
    const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
    const random = Math.random().toString(16).substring(2, 14);
    return `${hashStr.substring(0, 8)}-${random.substring(0, 4)}-5${random.substring(4, 7)}-${random.substring(7, 11)}-${random.substring(11)}`;
  }

  validate(input: string): boolean {
    return true; // UUID 生成不需要输入验证
  }
}
