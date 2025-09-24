const sql = require('mssql');

// Database configuration
const dbConfig = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'Radiocabs',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
    enableArithAbort: true,
    requestTimeout: 30000,
    connectionTimeout: 30000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  }
};

// Connection pool
let pool = null;

// Initialize database connection
const initializeDatabase = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(dbConfig);
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
const executeQuery = async (query, params = {}) => {
  try {
    const pool = await getConnection();
    const request = pool.request();
    
    // Add parameters to request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    const result = await request.query(query);
    return result;
  } catch (error) {
    console.error('❌ Query execution failed:', error);
    throw error;
  }
};

// Execute stored procedure
const executeProcedure = async (procedureName, params = {}) => {
  try {
    const pool = await getConnection();
    const request = pool.request();
    
    // Add parameters to request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    const result = await request.execute(procedureName);
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
      await pool.close();
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
  sql
};
