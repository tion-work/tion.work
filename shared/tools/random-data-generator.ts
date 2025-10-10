import { BaseTool } from './base';

export class RandomDataGeneratorTool extends BaseTool {
  id = 'random-data-generator';
  name = '随机数据生成器';
  description = '生成各种类型的随机测试数据，支持多种格式和自定义规则。';
  category = 'utility';
  icon = 'Shuffle';
  slug = 'random-data-generator';

  options = [
    {
      key: 'dataType',
      label: '数据类型',
      type: 'select',
      defaultValue: 'json',
      description: '选择生成的数据格式',
      options: [
        { value: 'json', label: 'JSON' },
        { value: 'csv', label: 'CSV' },
        { value: 'sql', label: 'SQL INSERT' },
        { value: 'xml', label: 'XML' }
      ]
    },
    {
      key: 'count',
      label: '生成数量',
      type: 'number',
      defaultValue: 10,
      description: '要生成的记录数量（1-1000）'
    },
    {
      key: 'fields',
      label: '字段配置',
      type: 'text',
      defaultValue: 'name,email,age,phone,address',
      description: '字段名称，用逗号分隔'
    },
    {
      key: 'includeId',
      label: '包含 ID',
      type: 'boolean',
      defaultValue: true,
      description: '是否为每条记录生成唯一 ID'
    }
  ];

  private dataGenerators = {
    name: () => this.getRandomName(),
    email: () => this.getRandomEmail(),
    age: () => Math.floor(Math.random() * 80) + 18,
    phone: () => this.getRandomPhone(),
    address: () => this.getRandomAddress(),
    city: () => this.getRandomCity(),
    country: () => this.getRandomCountry(),
    company: () => this.getRandomCompany(),
    job: () => this.getRandomJob(),
    website: () => this.getRandomWebsite(),
    description: () => this.getRandomDescription(),
    price: () => (Math.random() * 1000).toFixed(2),
    date: () => this.getRandomDate(),
    boolean: () => Math.random() > 0.5,
    color: () => this.getRandomColor(),
    uuid: () => this.getRandomUUID()
  };

  async process(input: string, options?: Record<string, any>): Promise<string> {
    const { 
      dataType = 'json', 
      count = 10, 
      fields = 'name,email,age,phone,address',
      includeId = true 
    } = options || {};
    
    try {
      const numCount = Math.min(Math.max(parseInt(count) || 10, 1), 1000);
      const fieldList = fields.split(',').map(f => f.trim()).filter(f => f);
      
      if (fieldList.length === 0) {
        throw new Error('请至少指定一个字段');
      }

      const records = this.generateRecords(fieldList, numCount, includeId);
      
      switch (dataType) {
        case 'json':
          return this.formatAsJSON(records);
        case 'csv':
          return this.formatAsCSV(records, fieldList, includeId);
        case 'sql':
          return this.formatAsSQL(records, fieldList, includeId);
        case 'xml':
          return this.formatAsXML(records, fieldList, includeId);
        default:
          return this.formatAsJSON(records);
      }
    } catch (error: any) {
      throw new Error(`随机数据生成失败: ${error.message}`);
    }
  }

  private generateRecords(fields: string[], count: number, includeId: boolean): any[] {
    const records: any[] = [];
    
    for (let i = 0; i < count; i++) {
      const record: any = {};
      
      if (includeId) {
        record.id = i + 1;
      }
      
      fields.forEach(field => {
        const generator = this.dataGenerators[field as keyof typeof this.dataGenerators];
        if (generator) {
          record[field] = generator();
        } else {
          // 默认生成随机字符串
          record[field] = this.getRandomString();
        }
      });
      
      records.push(record);
    }
    
    return records;
  }

  private formatAsJSON(records: any[]): string {
    return JSON.stringify(records, null, 2);
  }

  private formatAsCSV(records: any[], fields: string[], includeId: boolean): string {
    const headers = includeId ? ['id', ...fields] : fields;
    const csvRows = [headers.join(',')];
    
    records.forEach(record => {
      const row = headers.map(header => {
        const value = record[header];
        // 如果值包含逗号或引号，需要用引号包围并转义
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  private formatAsSQL(records: any[], fields: string[], includeId: boolean): string {
    const tableName = 'test_data';
    const allFields = includeId ? ['id', ...fields] : fields;
    const fieldList = allFields.join(', ');
    
    const sqlStatements = records.map(record => {
      const values = allFields.map(field => {
        const value = record[field];
        if (typeof value === 'string') {
          return `'${value.replace(/'/g, "''")}'`;
        }
        return value;
      }).join(', ');
      
      return `INSERT INTO ${tableName} (${fieldList}) VALUES (${values});`;
    });
    
    return sqlStatements.join('\n');
  }

  private formatAsXML(records: any[], fields: string[], includeId: boolean): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<records>\n';
    
    records.forEach(record => {
      xml += '  <record>\n';
      const allFields = includeId ? ['id', ...fields] : fields;
      allFields.forEach(field => {
        const value = record[field];
        xml += `    <${field}>${this.escapeXML(value)}</${field}>\n`;
      });
      xml += '  </record>\n';
    });
    
    xml += '</records>';
    return xml;
  }

  private escapeXML(value: any): string {
    if (typeof value === 'string') {
      return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    }
    return String(value);
  }

  // 数据生成方法
  private getRandomName(): string {
    const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴', '徐', '孙', '胡', '朱', '高', '林', '何', '郭', '马', '罗'];
    const lastNames = ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞'];
    return firstNames[Math.floor(Math.random() * firstNames.length)] + 
           lastNames[Math.floor(Math.random() * lastNames.length)];
  }

  private getRandomEmail(): string {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', '163.com', 'qq.com', 'sina.com'];
    const username = this.getRandomString(8).toLowerCase();
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${username}@${domain}`;
  }

  private getRandomPhone(): string {
    const prefixes = ['138', '139', '150', '151', '152', '188', '189', '130', '131', '132'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    return prefix + suffix;
  }

  private getRandomAddress(): string {
    const cities = ['北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市', '武汉市', '成都市', '西安市', '重庆市'];
    const districts = ['朝阳区', '海淀区', '西城区', '东城区', '丰台区', '石景山区', '门头沟区', '房山区', '通州区', '顺义区'];
    const streets = ['建国路', '复兴路', '长安街', '王府井大街', '西单北大街', '东单北大街', '前门大街', '大栅栏街', '琉璃厂街', '南锣鼓巷'];
    
    const city = cities[Math.floor(Math.random() * cities.length)];
    const district = districts[Math.floor(Math.random() * districts.length)];
    const street = streets[Math.floor(Math.random() * streets.length)];
    const number = Math.floor(Math.random() * 999) + 1;
    
    return `${city}${district}${street}${number}号`;
  }

  private getRandomCity(): string {
    const cities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '武汉', '成都', '西安', '重庆', '天津', '苏州', '长沙', '青岛', '无锡', '宁波', '郑州', '佛山', '东莞', '合肥'];
    return cities[Math.floor(Math.random() * cities.length)];
  }

  private getRandomCountry(): string {
    const countries = ['中国', '美国', '日本', '韩国', '英国', '法国', '德国', '意大利', '西班牙', '加拿大', '澳大利亚', '巴西', '印度', '俄罗斯', '墨西哥'];
    return countries[Math.floor(Math.random() * countries.length)];
  }

  private getRandomCompany(): string {
    const prefixes = ['北京', '上海', '深圳', '杭州', '广州', '成都', '武汉', '西安', '南京', '重庆'];
    const suffixes = ['科技有限公司', '信息技术有限公司', '网络科技有限公司', '软件有限公司', '数据科技有限公司', '智能科技有限公司', '创新科技有限公司', '数字科技有限公司'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const name = this.getRandomString(2, 4);
    return `${prefix}${name}${suffix}`;
  }

  private getRandomJob(): string {
    const jobs = ['软件工程师', '产品经理', 'UI设计师', '数据分析师', '运营专员', '销售经理', '市场专员', '财务经理', '人事专员', '项目经理', '测试工程师', '运维工程师', '架构师', '技术总监', 'CEO'];
    return jobs[Math.floor(Math.random() * jobs.length)];
  }

  private getRandomWebsite(): string {
    const domains = ['example.com', 'test.com', 'demo.com', 'sample.com', 'mock.com'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `https://www.${domain}`;
  }

  private getRandomDescription(): string {
    const descriptions = [
      '这是一个测试描述',
      '用于演示的数据',
      '随机生成的示例内容',
      '测试用的虚拟信息',
      '模拟的真实数据',
      '用于开发测试的样本',
      '演示用的示例数据',
      '测试环境的数据'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private getRandomDate(): string {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime).toISOString().split('T')[0];
  }

  private getRandomColor(): string {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33', '#33FFF5', '#FF8C33', '#8C33FF', '#33FF8C', '#FF338C'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private getRandomUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private getRandomString(length: number = 8, maxLength?: number): string {
    const actualLength = maxLength ? Math.floor(Math.random() * (maxLength - length + 1)) + length : length;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < actualLength; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  validate(input: string): boolean {
    return true; // 随机数据生成不需要输入验证
  }
}
