import { ToolCategory } from "@/types";
import { BaseTool } from "./base";

export class RandomDataGeneratorTool extends BaseTool {
  id = "random-data-generator";
  name = "Random Data Generator";
  description = "Generate random test data in various formats";
  category: ToolCategory = "utility";
  icon = "shuffle";
  color = "bg-pink-500";
  inputLanguage = "text";
  inputPlaceholder = "Enter number of records to generate...";
  outputLanguage = "json";
  initialInput = "5";
  options = [
    {
      name: "format",
      label: "Output Format",
      type: "select" as const,
      defaultValue: "json",
      description: "Choose output format",
      options: [
        { label: "JSON", value: "json" },
        { label: "CSV", value: "csv" },
        { label: "SQL", value: "sql" },
        { label: "XML", value: "xml" },
      ],
    },
    {
      name: "dataType",
      label: "Data Type",
      type: "select" as const,
      defaultValue: "user",
      description: "Choose data type to generate",
      options: [
        { label: "User Data", value: "user" },
        { label: "Product Data", value: "product" },
        { label: "Address Data", value: "address" },
        { label: "Company Data", value: "company" },
      ],
    },
    {
      name: "includeId",
      label: "Include ID",
      type: "boolean" as const,
      defaultValue: true,
      description: "Include unique ID field",
    },
  ];

  getLocalizedContent(language: "zh" | "en") {
    if (language === "en") {
      return {
        name: "Random Data Generator",
        description: "Generate random test data in various formats",
        inputPlaceholder: "Enter number of records to generate...",
        options: [
          {
            name: "format",
            label: "Output Format",
            type: "select",
            defaultValue: "json",
            description: "Choose output format",
            options: [
              { label: "JSON", value: "json" },
              { label: "CSV", value: "csv" },
              { label: "SQL", value: "sql" },
              { label: "XML", value: "xml" },
            ],
          },
          {
            name: "dataType",
            label: "Data Type",
            type: "select",
            defaultValue: "user",
            description: "Choose data type to generate",
            options: [
              { label: "User Data", value: "user" },
              { label: "Product Data", value: "product" },
              { label: "Address Data", value: "address" },
              { label: "Company Data", value: "company" },
            ],
          },
          {
            name: "includeId",
            label: "Include ID",
            type: "boolean",
            defaultValue: true,
            description: "Include unique ID field",
          },
        ],
      };
    }

    return {
      name: "随机数据生成器",
      description: "生成各种格式的随机测试数据",
      inputPlaceholder: "请输入要生成的记录数量...",
      options: [
        {
          name: "format",
          label: "输出格式",
          type: "select",
          defaultValue: "json",
          description: "选择输出格式",
          options: [
            { label: "JSON", value: "json" },
            { label: "CSV", value: "csv" },
            { label: "SQL", value: "sql" },
            { label: "XML", value: "xml" },
          ],
        },
        {
          name: "dataType",
          label: "数据类型",
          type: "select",
          defaultValue: "user",
          description: "选择要生成的数据类型",
          options: [
            { label: "用户数据", value: "user" },
            { label: "产品数据", value: "product" },
            { label: "地址数据", value: "address" },
            { label: "公司数据", value: "company" },
          ],
        },
        {
          name: "includeId",
          label: "包含ID",
          type: "boolean",
          defaultValue: true,
          description: "包含唯一ID字段",
        },
      ],
    };
  }

  async process(
    input: string,
    options: Record<string, any> = {}
  ): Promise<string> {
    const { format = "json", dataType = "user", includeId = true } = options;

    const count = parseInt(input) || 1;
    const records = [];

    for (let i = 0; i < count; i++) {
      const record = this.generateRecord(dataType, includeId, i + 1);
      records.push(record);
    }

    switch (format) {
      case "json":
        return JSON.stringify(records, null, 2);
      case "csv":
        return this.toCSV(records);
      case "sql":
        return this.toSQL(records, dataType);
      case "xml":
        return this.toXML(records, dataType);
      default:
        return JSON.stringify(records, null, 2);
    }
  }

  private generateRecord(
    dataType: string,
    includeId: boolean,
    index: number
  ): any {
    const record: any = {};

    if (includeId) {
      record.id = index;
    }

    switch (dataType) {
      case "user":
        record.name = this.randomName();
        record.email = this.randomEmail();
        record.age = Math.floor(Math.random() * 50) + 18;
        record.phone = this.randomPhone();
        record.city = this.randomCity();
        break;
      case "product":
        record.name = this.randomProductName();
        record.price = (Math.random() * 1000).toFixed(2);
        record.category = this.randomCategory();
        record.inStock = Math.random() > 0.5;
        record.description = this.randomDescription();
        break;
      case "address":
        record.street = this.randomStreet();
        record.city = this.randomCity();
        record.state = this.randomState();
        record.zipCode = this.randomZipCode();
        record.country = this.randomCountry();
        break;
      case "company":
        record.name = this.randomCompanyName();
        record.industry = this.randomIndustry();
        record.employees = Math.floor(Math.random() * 1000) + 10;
        record.founded = Math.floor(Math.random() * 50) + 1970;
        record.website = this.randomWebsite();
        break;
    }

    return record;
  }

  private randomName(): string {
    const firstNames = [
      "John",
      "Jane",
      "Mike",
      "Sarah",
      "David",
      "Lisa",
      "Chris",
      "Amy",
      "Tom",
      "Emma",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
    ];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]
    }`;
  }

  private randomEmail(): string {
    const domains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "example.com",
    ];
    const username = Math.random().toString(36).substring(2, 8);
    return `${username}@${domains[Math.floor(Math.random() * domains.length)]}`;
  }

  private randomPhone(): string {
    return `+1-${Math.floor(Math.random() * 900) + 100}-${
      Math.floor(Math.random() * 900) + 100
    }-${Math.floor(Math.random() * 9000) + 1000}`;
  }

  private randomCity(): string {
    const cities = [
      "New York",
      "Los Angeles",
      "Chicago",
      "Houston",
      "Phoenix",
      "Philadelphia",
      "San Antonio",
      "San Diego",
      "Dallas",
      "San Jose",
    ];
    return cities[Math.floor(Math.random() * cities.length)];
  }

  private randomProductName(): string {
    const adjectives = [
      "Amazing",
      "Super",
      "Ultra",
      "Pro",
      "Elite",
      "Premium",
      "Advanced",
      "Smart",
      "Digital",
      "Modern",
    ];
    const nouns = [
      "Widget",
      "Gadget",
      "Device",
      "Tool",
      "App",
      "Software",
      "System",
      "Platform",
      "Service",
      "Solution",
    ];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${
      nouns[Math.floor(Math.random() * nouns.length)]
    }`;
  }

  private randomCategory(): string {
    const categories = [
      "Electronics",
      "Clothing",
      "Books",
      "Home",
      "Sports",
      "Toys",
      "Beauty",
      "Automotive",
      "Health",
      "Food",
    ];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private randomDescription(): string {
    const descriptions = [
      "High quality product",
      "Best in class",
      "Premium materials",
      "Innovative design",
      "User friendly",
      "Durable construction",
      "Modern technology",
      "Eco-friendly",
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private randomStreet(): string {
    const numbers = Math.floor(Math.random() * 9999) + 1;
    const streets = [
      "Main St",
      "Oak Ave",
      "Pine Rd",
      "Elm St",
      "Maple Dr",
      "Cedar Ln",
      "First St",
      "Second Ave",
      "Park Rd",
      "Garden St",
    ];
    return `${numbers} ${streets[Math.floor(Math.random() * streets.length)]}`;
  }

  private randomState(): string {
    const states = ["CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI"];
    return states[Math.floor(Math.random() * states.length)];
  }

  private randomZipCode(): string {
    return (Math.floor(Math.random() * 90000) + 10000).toString();
  }

  private randomCountry(): string {
    return "United States";
  }

  private randomCompanyName(): string {
    const prefixes = [
      "Global",
      "Universal",
      "Advanced",
      "Dynamic",
      "Innovative",
      "Creative",
      "Strategic",
      "Professional",
      "Elite",
      "Prime",
    ];
    const suffixes = [
      "Corp",
      "Inc",
      "LLC",
      "Ltd",
      "Group",
      "Solutions",
      "Systems",
      "Technologies",
      "Enterprises",
      "Partners",
    ];
    const names = [
      "Tech",
      "Data",
      "Cloud",
      "Digital",
      "Smart",
      "Future",
      "Next",
      "Alpha",
      "Beta",
      "Gamma",
    ];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${
      names[Math.floor(Math.random() * names.length)]
    } ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  }

  private randomIndustry(): string {
    const industries = [
      "Technology",
      "Healthcare",
      "Finance",
      "Education",
      "Manufacturing",
      "Retail",
      "Real Estate",
      "Transportation",
      "Energy",
      "Media",
    ];
    return industries[Math.floor(Math.random() * industries.length)];
  }

  private randomWebsite(): string {
    const domains = [
      "company.com",
      "business.org",
      "enterprise.net",
      "corp.io",
      "group.co",
    ];
    return `https://www.${domains[Math.floor(Math.random() * domains.length)]}`;
  }

  private toCSV(records: any[]): string {
    if (records.length === 0) return "";

    const headers = Object.keys(records[0]);
    const csv = [headers.join(",")];

    records.forEach((record) => {
      const values = headers.map((header) => {
        const value = record[header];
        return typeof value === "string" && value.includes(",")
          ? `"${value}"`
          : value;
      });
      csv.push(values.join(","));
    });

    return csv.join("\n");
  }

  private toSQL(records: any[], dataType: string): string {
    const tableName = dataType + "s";
    const columns = Object.keys(records[0]);

    let sql = `CREATE TABLE ${tableName} (\n`;
    sql += columns.map((col) => `  ${col} VARCHAR(255)`).join(",\n");
    sql += "\n);\n\n";

    records.forEach((record) => {
      const values = columns.map((col) => `'${record[col]}'`).join(", ");
      sql += `INSERT INTO ${tableName} (${columns.join(
        ", "
      )}) VALUES (${values});\n`;
    });

    return sql;
  }

  private toXML(records: any[], dataType: string): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${dataType}s>\n`;

    records.forEach((record) => {
      xml += `  <${dataType}>\n`;
      Object.entries(record).forEach(([key, value]) => {
        xml += `    <${key}>${value}</${key}>\n`;
      });
      xml += `  </${dataType}>\n`;
    });

    xml += `</${dataType}s>`;
    return xml;
  }

  validate(input: string): boolean {
    const num = parseInt(input);
    return !isNaN(num) && num > 0 && num <= 1000;
  }
}
