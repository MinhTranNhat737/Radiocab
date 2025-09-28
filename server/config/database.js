const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'radiocabs',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '18112003',
  port: parseInt(process.env.DB_PORT) || 4000,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 30000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

// Connection pool
let pool = null;

// Initialize database connection
const initializeDatabase = async () => {
  try {
    if (!pool) {
      pool = new Pool(dbConfig);
      console.log('✅ Database connected successfully');
    }
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

// Get database connection
const getConnection = async () => {
  try {
    if (!pool) {
      await initializeDatabase();
    }
    return pool;
  } catch (error) {
    console.error('❌ Failed to get database connection:', error);
    throw error;
  }
};

// Execute query
const executeQuery = async (query, params = []) => {
  try {
    const pool = await getConnection();
    const result = await pool.query(query, params);
    return result;
  } catch (error) {
    console.error('❌ Query execution failed:', error);
    throw error;
  }
};

// Execute stored procedure (PostgreSQL function)
const executeProcedure = async (procedureName, params = []) => {
  try {
    const pool = await getConnection();
    const result = await pool.query(`SELECT * FROM ${procedureName}(${params.map((_, i) => `$${i + 1}`).join(', ')})`, params);
    return result;
  } catch (error) {
    console.error('❌ Stored procedure execution failed:', error);
    throw error;
  }
};

// Close database connection
const closeConnection = async () => {
  try {
    if (pool) {
      await pool.end();
      pool = null;
      console.log('✅ Database connection closed');
    }
  } catch (error) {
    console.error('❌ Failed to close database connection:', error);
    throw error;
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  console.log('🔄 Closing database connection...');
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Closing database connection...');
  await closeConnection();
  process.exit(0);
});

module.exports = {
  initializeDatabase,
  getConnection,
  executeQuery,
  executeProcedure,
  closeConnection,
  Pool
};
