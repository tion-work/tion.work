import { ToolService } from '../toolService';

describe('ToolService', () => {
  let toolService: ToolService;

  beforeEach(() => {
    toolService = new ToolService();
  });

  describe('getAllTools', () => {
    it('should return all active tools', async () => {
      const tools = await toolService.getAllTools();
      
      expect(tools).toBeDefined();
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);
      expect(tools.every(tool => tool.isActive)).toBe(true);
    });
  });

  describe('getToolById', () => {
    it('should return tool by id', async () => {
      const tool = await toolService.getToolById('json-formatter');
      
      expect(tool).toBeDefined();
      expect(tool?.id).toBe('json-formatter');
      expect(tool?.isActive).toBe(true);
    });

    it('should return null for non-existent tool', async () => {
      const tool = await toolService.getToolById('non-existent');
      
      expect(tool).toBeNull();
    });
  });

  describe('getToolsByCategory', () => {
    it('should return tools by category', async () => {
      const tools = await toolService.getToolsByCategory('code');
      
      expect(tools).toBeDefined();
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.every(tool => tool.category === 'code')).toBe(true);
    });
  });

  describe('searchTools', () => {
    it('should search tools by name', async () => {
      const tools = await toolService.searchTools('json');
      
      expect(tools).toBeDefined();
      expect(Array.isArray(tools)).toBe(true);
      expect(tools.some(tool => tool.name.toLowerCase().includes('json'))).toBe(true);
    });

    it('should search tools by description', async () => {
      const tools = await toolService.searchTools('format');
      
      expect(tools).toBeDefined();
      expect(Array.isArray(tools)).toBe(true);
    });
  });

  describe('processTool', () => {
    it('should process json-formatter tool', async () => {
      const request = {
        toolId: 'json-formatter',
        input: '{"name":"test"}',
        options: { indent: 2 }
      };

      const result = await toolService.processTool(request);
      
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.processingTime).toBeGreaterThan(0);
    });

    it('should process base64-encoder tool', async () => {
      const request = {
        toolId: 'base64-encoder',
        input: 'hello world',
        options: { operation: 'encode' }
      };

      const result = await toolService.processTool(request);
      
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
    });

    it('should process password-generator tool', async () => {
      const request = {
        toolId: 'password-generator',
        input: '',
        options: { length: 12 }
      };

      const result = await toolService.processTool(request);
      
      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.result.length).toBe(12);
    });

    it('should return error for non-existent tool', async () => {
      const request = {
        toolId: 'non-existent',
        input: 'test',
        options: {}
      };

      const result = await toolService.processTool(request);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should return error for invalid input', async () => {
      const request = {
        toolId: 'json-formatter',
        input: 'invalid json',
        options: {}
      };

      const result = await toolService.processTool(request);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      const categories = await toolService.getCategories();
      
      expect(categories).toBeDefined();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });
  });
});
