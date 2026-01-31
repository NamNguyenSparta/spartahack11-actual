import snowflake from 'snowflake-sdk';
import dotenv from 'dotenv';

dotenv.config();

let connection = null;

// Create Snowflake connection with PAT or password authentication
export async function connectSnowflake() {
  return new Promise((resolve, reject) => {
    if (connection && connection.isUp()) {
      resolve(connection);
      return;
    }

    // Build connection config
    const connectionConfig = {
      account: process.env.SNOWFLAKE_ACCOUNT,
      username: process.env.SNOWFLAKE_USERNAME,
      database: process.env.SNOWFLAKE_DATABASE,
      schema: process.env.SNOWFLAKE_SCHEMA,
      warehouse: process.env.SNOWFLAKE_WAREHOUSE,
      role: process.env.SNOWFLAKE_ROLE || 'ACCOUNTADMIN',
    };

    // Use PAT token if available, otherwise use password
    if (process.env.SNOWFLAKE_PAT_TOKEN) {
      connectionConfig.authenticator = 'PROGRAMMATIC_ACCESS_TOKEN';
      connectionConfig.token = process.env.SNOWFLAKE_PAT_TOKEN;
      console.log('🔐 Using PAT token authentication');
    } else if (process.env.SNOWFLAKE_PASSWORD) {
      connectionConfig.password = process.env.SNOWFLAKE_PASSWORD;
      console.log('🔐 Using password authentication');
    } else {
      reject(new Error('No Snowflake authentication method provided'));
      return;
    }

    const conn = snowflake.createConnection(connectionConfig);

    conn.connect((err, connectedConn) => {
      if (err) {
        console.error('❌ Failed to connect to Snowflake:', err.message);
        reject(err);
      } else {
        console.log('✅ Connected to Snowflake successfully!');
        console.log(`   Database: ${process.env.SNOWFLAKE_DATABASE}`);
        console.log(`   Warehouse: ${process.env.SNOWFLAKE_WAREHOUSE}`);
        connection = connectedConn;
        resolve(connectedConn);
      }
    });
  });
}

// Execute query
export async function executeQuery(sqlText, binds = []) {
  const conn = await connectSnowflake();

  return new Promise((resolve, reject) => {
    conn.execute({
      sqlText,
      binds,
      complete: (err, stmt, rows) => {
        if (err) {
          console.error('Query error:', err.message);
          reject(err);
        } else {
          resolve(rows);
        }
      }
    });
  });
}

// Test connection
export async function testConnection() {
  try {
    const rows = await executeQuery('SELECT CURRENT_TIMESTAMP() as now, CURRENT_USER() as user');
    console.log('✅ Snowflake test query successful:', rows[0]);
    return { success: true, data: rows[0] };
  } catch (error) {
    console.error('❌ Snowflake test failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Get payment reliability data
export async function getPaymentReliability(userId) {
  const sql = `
    SELECT 
      COUNT(CASE WHEN status = 'on_time' THEN 1 END) as on_time_count,
      COUNT(*) as total_count,
      ROUND(COUNT(CASE WHEN status = 'on_time' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 0) as score
    FROM (
      SELECT status FROM RENT_PAYMENTS WHERE user_id = ?
      UNION ALL
      SELECT status FROM UTILITY_PAYMENTS WHERE user_id = ?
    ) combined
    WHERE payment_date >= DATEADD(month, -12, CURRENT_DATE)
  `;

  try {
    const rows = await executeQuery(sql, [userId, userId]);
    return rows[0] || { on_time_count: 0, total_count: 0, score: 0 };
  } catch (error) {
    console.error('Payment reliability query error:', error);
    return { on_time_count: 0, total_count: 0, score: 50 };
  }
}

// Get savings stability data
export async function getSavingsStability(userId) {
  const sql = `
    WITH savings_data AS (
      SELECT 
        balance,
        snapshot_date,
        FIRST_VALUE(balance) OVER (ORDER BY snapshot_date) as first_balance,
        LAST_VALUE(balance) OVER (ORDER BY snapshot_date ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as last_balance
      FROM SAVINGS_BALANCE
      WHERE user_id = ?
        AND snapshot_date >= DATEADD(month, -6, CURRENT_DATE)
    )
    SELECT 
      ROUND(((MAX(last_balance) - MAX(first_balance)) / NULLIF(MAX(first_balance), 0)) * 100, 1) as growth_percent,
      AVG(balance) as avg_balance,
      MIN(balance) as min_balance,
      MAX(balance) as max_balance
    FROM savings_data
  `;

  try {
    const rows = await executeQuery(sql, [userId]);
    return rows[0] || { growth_percent: 0, avg_balance: 0 };
  } catch (error) {
    console.error('Savings stability query error:', error);
    return { growth_percent: 0, avg_balance: 0 };
  }
}

// Get income consistency data
export async function getIncomeConsistency(userId) {
  const sql = `
    SELECT 
      COUNT(DISTINCT DATE_TRUNC('month', deposit_date)) as months_with_income,
      AVG(amount) as avg_deposit,
      STDDEV(amount) as deposit_stddev,
      MAX(source_name) as source
    FROM INCOME_DEPOSITS
    WHERE user_id = ?
      AND deposit_date >= DATEADD(month, -6, CURRENT_DATE)
  `;

  try {
    const rows = await executeQuery(sql, [userId]);
    return rows[0] || { months_with_income: 0, avg_deposit: 0, source: 'Unknown' };
  } catch (error) {
    console.error('Income consistency query error:', error);
    return { months_with_income: 0, avg_deposit: 0 };
  }
}

// Get spending stability data
export async function getSpendingStability(userId) {
  const sql = `
    WITH monthly_spending AS (
      SELECT 
        DATE_TRUNC('month', transaction_date) as month,
        SUM(amount) as monthly_spend
      FROM SPENDING_TRANSACTIONS
      WHERE user_id = ?
        AND transaction_date >= DATEADD(month, -6, CURRENT_DATE)
      GROUP BY DATE_TRUNC('month', transaction_date)
    )
    SELECT 
      AVG(monthly_spend) as avg_monthly_spend,
      STDDEV(monthly_spend) as spend_stddev,
      ROUND((STDDEV(monthly_spend) / NULLIF(AVG(monthly_spend), 0)) * 100, 1) as volatility_percent
    FROM monthly_spending
  `;

  try {
    const rows = await executeQuery(sql, [userId]);
    return rows[0] || { avg_monthly_spend: 0, volatility_percent: 0 };
  } catch (error) {
    console.error('Spending stability query error:', error);
    return { avg_monthly_spend: 0, volatility_percent: 0 };
  }
}

// Get payment history for charts
export async function getPaymentHistory(userId) {
  const sql = `
    SELECT 
      TO_CHAR(DATE_TRUNC('month', payment_date), 'Mon') as month,
      COUNT(CASE WHEN status = 'on_time' THEN 1 END) as on_time,
      COUNT(CASE WHEN status = 'late' THEN 1 END) as late
    FROM (
      SELECT payment_date, status FROM RENT_PAYMENTS WHERE user_id = ?
      UNION ALL
      SELECT payment_date, status FROM UTILITY_PAYMENTS WHERE user_id = ?
    ) combined
    WHERE payment_date >= DATEADD(month, -6, CURRENT_DATE)
    GROUP BY DATE_TRUNC('month', payment_date)
    ORDER BY DATE_TRUNC('month', payment_date)
  `;

  try {
    const rows = await executeQuery(sql, [userId, userId]);
    return rows;
  } catch (error) {
    console.error('Payment history query error:', error);
    return [];
  }
}

// Get savings history for charts
export async function getSavingsHistory(userId) {
  const sql = `
    SELECT 
      TO_CHAR(snapshot_date, 'Mon') as month,
      balance as amount
    FROM SAVINGS_BALANCE
    WHERE user_id = ?
      AND snapshot_date >= DATEADD(month, -6, CURRENT_DATE)
    ORDER BY snapshot_date
  `;

  try {
    const rows = await executeQuery(sql, [userId]);
    return rows;
  } catch (error) {
    console.error('Savings history query error:', error);
    return [];
  }
}

// Initialize database schema
export async function initializeSchema() {
  console.log('📦 Initializing Snowflake schema...');

  const createTables = `
    -- Create tables if they don't exist
    CREATE TABLE IF NOT EXISTS USERS (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
    );

    CREATE TABLE IF NOT EXISTS RENT_PAYMENTS (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      payment_date DATE NOT NULL,
      due_date DATE NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) NOT NULL,
      created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
    );

    CREATE TABLE IF NOT EXISTS UTILITY_PAYMENTS (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      utility_type VARCHAR(50) NOT NULL,
      payment_date DATE NOT NULL,
      due_date DATE NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status VARCHAR(20) NOT NULL,
      created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
    );

    CREATE TABLE IF NOT EXISTS INCOME_DEPOSITS (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      deposit_date DATE NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      source VARCHAR(100),
      source_name VARCHAR(255),
      created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
    );

    CREATE TABLE IF NOT EXISTS SAVINGS_BALANCE (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      snapshot_date DATE NOT NULL,
      balance DECIMAL(12,2) NOT NULL,
      created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
    );

    CREATE TABLE IF NOT EXISTS SPENDING_TRANSACTIONS (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      transaction_date DATE NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      category VARCHAR(100),
      created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
    );
  `;

  try {
    // Execute each statement separately
    const statements = createTables.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      if (stmt.trim()) {
        await executeQuery(stmt);
      }
    }
    console.log('✅ Schema initialized');
    return true;
  } catch (error) {
    console.error('❌ Schema initialization error:', error.message);
    return false;
  }
}

export default {
  connectSnowflake,
  testConnection,
  executeQuery,
  getPaymentReliability,
  getSavingsStability,
  getIncomeConsistency,
  getSpendingStability,
  getPaymentHistory,
  getSavingsHistory,
  initializeSchema,
};
