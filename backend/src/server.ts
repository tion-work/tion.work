import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { toolService } from './services/toolService';
import database from './lib/database';
import redis from './lib/redis';
import logger from './lib/logger';
import { ToolProcessRequest } from './types';

const fastify: FastifyInstance = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// 注册插件
async function registerPlugins() {
  // CORS 配置
  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // 安全头配置
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  });

  // 速率限制
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Swagger 文档
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'dev.tion.work API',
        description: '开发者工具集合平台 API',
        version: '1.0.0',
      },
      host: process.env.API_URL || 'localhost:3001',
      schemes: ['http', 'https'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
  });
}

// 注册路由
async function registerRoutes() {
  // 健康检查
  fastify.get('/api/health', async (_request, _reply) => {
    const dbHealth = await database.healthCheck();
    const redisHealth = await redis.healthCheck();
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbHealth ? 'healthy' : 'unhealthy',
        redis: redisHealth ? 'healthy' : 'unhealthy',
      },
    };
  });

  // 工具列表
  fastify.get('/api/tools', async (_request, reply) => {
    try {
      const tools = await toolService.getAllTools();
      return { tools };
    } catch (error) {
      logger.error('Failed to get tools:', error);
      return reply.code(500).send({ error: 'Failed to get tools' });
    }
  });

  // 获取单个工具
  fastify.get('/api/tools/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const tool = await toolService.getToolById(id);
      
      if (!tool) {
        return reply.code(404).send({ error: 'Tool not found' });
      }
      
      return tool;
    } catch (error) {
      logger.error('Failed to get tool:', error);
      return reply.code(500).send({ error: 'Failed to get tool' });
    }
  });

  // 工具处理
  fastify.post('/api/tools/:toolId/process', async (request, reply) => {
    try {
      const { toolId } = request.params as { toolId: string };
      const { input, options } = request.body as { input: string; options?: any };

      const processRequest: ToolProcessRequest = {
        toolId,
        input,
        options,
      };

      const result = await toolService.processTool(processRequest);
      
      if (!result.success) {
        return reply.code(400).send(result);
      }
      
      return result;
    } catch (error) {
      logger.error('Tool processing failed:', error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
        processingTime: 0,
      });
    }
  });

  // 搜索工具
  fastify.get('/api/search', async (request, reply) => {
    try {
      const { q } = request.query as { q: string };
      
      if (!q) {
        return reply.code(400).send({ error: 'Query parameter is required' });
      }
      
      const results = await toolService.searchTools(q);
      return { results };
    } catch (error) {
      logger.error('Search failed:', error);
      return reply.code(500).send({ error: 'Search failed' });
    }
  });

  // 获取分类
  fastify.get('/api/categories', async (_request, reply) => {
    try {
      const categories = await toolService.getCategories();
      return { categories };
    } catch (error) {
      logger.error('Failed to get categories:', error);
      return reply.code(500).send({ error: 'Failed to get categories' });
    }
  });

  // 获取热门工具
  fastify.get('/api/tools/popular', async (request, reply) => {
    try {
      const { limit } = request.query as { limit?: string };
      const tools = await toolService.getPopularTools(limit ? parseInt(limit) : 10);
      return { tools };
    } catch (error) {
      logger.error('Failed to get popular tools:', error);
      return reply.code(500).send({ error: 'Failed to get popular tools' });
    }
  });

  // 获取最近工具
  fastify.get('/api/tools/recent', async (request, reply) => {
    try {
      const { limit } = request.query as { limit?: string };
      const tools = await toolService.getRecentTools(limit ? parseInt(limit) : 10);
      return { tools };
    } catch (error) {
      logger.error('Failed to get recent tools:', error);
      return reply.code(500).send({ error: 'Failed to get recent tools' });
    }
  });

  // 用户反馈
  fastify.post('/api/feedback', async (request, reply) => {
    try {
      const { type, subject, email } = request.body as {
        type: 'bug' | 'feature' | 'general';
        subject: string;
        message: string;
        email?: string;
      };

      // 这里应该保存到数据库
      logger.info('Feedback received', { type, subject, email });
      
      return {
        success: true,
        message: '反馈已收到，感谢您的建议！',
      };
    } catch (error) {
      logger.error('Failed to submit feedback:', error);
      return reply.code(500).send({ error: 'Failed to submit feedback' });
    }
  });
}

// 启动服务器
async function start() {
  try {
    // 连接数据库 (开发环境可选)
    try {
      await database.connect();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.warn('Database connection failed, running without database:', error instanceof Error ? error.message : String(error));
    }
    
    // 连接 Redis (开发环境可选)
    try {
      await redis.connect();
      logger.info('Redis connected successfully');
    } catch (error) {
      logger.warn('Redis connection failed, running without cache:', error instanceof Error ? error.message : String(error));
    }
    
    // 注册插件和路由
    await registerPlugins();
    await registerRoutes();

    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    logger.info(`🚀 Server running at http://${host}:${port}`);
    logger.info(`📚 API docs available at http://${host}:${port}/docs`);
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  logger.info('Shutting down server...');
  
  try {
    await fastify.close();
    await database.disconnect();
    await redis.disconnect();
    logger.info('Server shut down successfully');
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  
  try {
    await fastify.close();
    await database.disconnect();
    await redis.disconnect();
    logger.info('Server shut down successfully');
    process.exit(0);
  } catch (err) {
    logger.error('Error during shutdown:', err);
    process.exit(1);
  }
});

start();
