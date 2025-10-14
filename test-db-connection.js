// 测试数据库连接
const { Pool } = require("pg");

// 从环境变量获取数据库连接信息
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log("❌ DATABASE_URL 环境变量未设置");
  console.log("请设置 DATABASE_URL 环境变量，例如：");
  console.log(
    'export DATABASE_URL="postgres://username:password@host:port/database"'
  );
  process.exit(1);
}

console.log("🔍 测试数据库连接...");
console.log("数据库 URL:", databaseUrl.replace(/:[^:@]*@/, ":***@")); // 隐藏密码

const pool = new Pool({
  connectionString: databaseUrl,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("✅ 数据库连接成功");

    // 检查当前数据库
    const dbResult = await client.query("SELECT current_database()");
    console.log("📊 当前数据库:", dbResult.rows[0].current_database);

    // 检查现有表
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log("📋 现有表:");
    if (tablesResult.rows.length === 0) {
      console.log("  (无表)");
    } else {
      tablesResult.rows.forEach((row) => {
        console.log(`  - ${row.table_name}`);
      });
    }

    // 检查数据库大小
    const sizeResult = await client.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `);
    console.log("💾 数据库大小:", sizeResult.rows[0].size);

    client.release();
    await pool.end();

    console.log("🎉 数据库连接测试完成");
  } catch (error) {
    console.error("❌ 数据库连接失败:", error.message);
    console.error("错误代码:", error.code);
    process.exit(1);
  }
}

testConnection();
