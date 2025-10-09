import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const fastify = Fastify({
  logger: {
    level: process.env['NODE_ENV'] === 'production' ? 'info' : 'debug',
  },
});

// 注册插件
async function registerPlugins() {
  // CORS 配置
  await fastify.register(cors, {
    origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
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
        title: 'tion.work API',
        description: '开发者工具集合平台 API',
        version: '1.0.0',
      },
      host: process.env['API_URL'] || 'localhost:3001',
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
  fastify.get('/api/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env['NODE_ENV'] || 'development',
    };
  });

  // 工具列表
  fastify.get('/api/tools', async () => {
    return {
      tools: [
        {
          id: 'json-formatter',
          name: 'JSON Formatter',
          description: '格式化 JSON 数据',
          category: 'code',
          icon: 'code',
        },
        {
          id: 'base64-encoder',
          name: 'Base64 Encoder',
          description: 'Base64 编码/解码',
          category: 'data',
          icon: 'lock',
        },
        {
          id: 'timestamp-converter',
          name: 'Timestamp Converter',
          description: '时间戳转换器',
          category: 'data',
          icon: 'clock',
        },
        {
          id: 'password-generator',
          name: 'Password Generator',
          description: '安全密码生成器',
          category: 'security',
          icon: 'key',
        },
        {
          id: 'qr-code-generator',
          name: 'QR Code Generator',
          description: '二维码生成器',
          category: 'utility',
          icon: 'qr-code',
        },
      ],
    };
  });

  // 工具处理
  fastify.post('/api/tools/:toolId/process', async (request, reply) => {
    const { toolId } = request.params as { toolId: string };
    const { input, options } = request.body as { input: string; options?: any };

    try {
      let result: string;

      switch (toolId) {
        case 'json-formatter':
          result = JSON.stringify(JSON.parse(input), null, options?.indent || 2);
          break;
        case 'base64-encoder':
          result = Buffer.from(input, 'utf8').toString('base64');
          break;
        case 'timestamp-converter':
          const timestamp = parseInt(input);
          result = new Date(timestamp).toISOString();
          break;
        case 'password-generator':
          const length = options?.length || 12;
          const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
          result = Array.from({ length }, () => charset[Math.floor(Math.random() * charset.length)]).join('');
          break;
        default:
          return reply.code(400).send({ error: 'Unknown tool' });
      }

      return {
        success: true,
        result,
        processingTime: Date.now() - Date.now(),
      };
    } catch (error) {
      return reply.code(400).send({
        success: false,
        error: error instanceof Error ? error.message : 'Processing failed',
      });
    }
  });
}

// 启动服务器
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    const port = parseInt(process.env['PORT'] || '3001');
    const host = process.env['HOST'] || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`🚀 Server running at http://${host}:${port}`);
    console.log(`📚 API docs available at http://${host}:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await fastify.close();
  process.exit(0);
});

start();
