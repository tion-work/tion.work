import { JsonFormatterTool } from '../json-formatter';

describe('JsonFormatterTool', () => {
  let tool: JsonFormatterTool;

  beforeEach(() => {
    tool = new JsonFormatterTool();
  });

  describe('process', () => {
    it('should format valid JSON with default options', async () => {
      const input = '{"name":"test","value":123}';
      const result = await tool.process(input);
      
      expect(result).toContain('"name": "test"');
      expect(result).toContain('"value": 123');
    });

    it('should format JSON with custom indent', async () => {
      const input = '{"name":"test","value":123}';
      const result = await tool.process(input, { indent: 4 });
      
      expect(result).toContain('    "name": "test"');
    });

    it('should minify JSON when minify option is true', async () => {
      const input = '{"name":"test","value":123}';
      const result = await tool.process(input, { minify: true });
      
      expect(result).toBe('{"name":"test","value":123}');
    });

    it('should sort keys when sortKeys option is true', async () => {
      const input = '{"z":"last","a":"first","m":"middle"}';
      const result = await tool.process(input, { sortKeys: true });
      
      const lines = result.split('\n');
      expect(lines[1]).toContain('"a": "first"');
      expect(lines[2]).toContain('"m": "middle"');
      expect(lines[3]).toContain('"z": "last"');
    });

    it('should handle empty input', async () => {
      const result = await tool.process('');
      expect(result).toBe('');
    });

    it('should throw error for invalid JSON', async () => {
      const input = 'invalid json';
      
      await expect(tool.process(input)).rejects.toThrow('JSON 解析失败');
    });
  });

  describe('validate', () => {
    it('should return true for valid JSON', () => {
      expect(tool.validate('{"name":"test"}')).toBe(true);
    });

    it('should return false for invalid JSON', () => {
      expect(tool.validate('invalid json')).toBe(false);
    });

    it('should return true for empty input', () => {
      expect(tool.validate('')).toBe(true);
    });
  });
});
