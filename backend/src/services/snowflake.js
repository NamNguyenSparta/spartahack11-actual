import snowflake from 'snowflake-sdk';
import dotenv from 'dotenv';

dotenv.config();

let connection = null;

// Create Snowflake connection
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

    // Use OAuth token authentication for PAT
    if (process.env.SNOWFLAKE_PAT_TOKEN) {
      // PAT tokens work with OAUTH authenticator
      connectionConfig.authenticator = 'OAUTH';
      connectionConfig.token = process.env.SNOWFLAKE_PAT_TOKEN;
      console.log('🔐 Using OAuth/PAT token authentication');
    } else if (process.env.SNOWFLAKE_PASSWORD) {
      connectionConfig.password = process.env.SNOWFLAKE_PASSWORD;
      console.log('🔐 Using password authentication');
    } else {
      reject(new Error('No Snowflake authentication method provided'));
      return;
    }

    console.log(`📡 Connecting to Snowflake: ${connectionConfig.account}`);

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

// Test connection with simple query
export async function testConnection() {
  try {
    const rows = await executeQuery('SELECT CURRENT_TIMESTAMP() as now, CURRENT_USER() as user, CURRENT_DATABASE() as db');
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
      SELECT status, payment_date FROM RENT_PAYMENTS WHERE user_id = ?
      UNION ALL
      SELECT status, payment_date FROM UTILITY_PAYMENTS WHERE user_id = ?
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

// Initialize database schema and demo data
export async function initializeSchema() {
  console.log('📦 Initializing Snowflake schema...');

  try {
    // Create database if not exists
    await executeQuery(`CREATE DATABASE IF NOT EXISTS CREDENCE_DB`);
    await executeQuery(`USE DATABASE CREDENCE_DB`);
    await executeQuery(`CREATE SCHEMA IF NOT EXISTS PUBLIC`);
    await executeQuery(`USE SCHEMA PUBLIC`);

    // Create warehouse if needed
    await executeQuery(`CREATE WAREHOUSE IF NOT EXISTS COMPUTE_WH 
      WITH WAREHOUSE_SIZE = 'XSMALL' 
      AUTO_SUSPEND = 60 
      AUTO_RESUME = TRUE`);

    // Create tables
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS USERS (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255),
        name VARCHAR(255),
        created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
      )
    `);

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS RENT_PAYMENTS (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        payment_date DATE NOT NULL,
        due_date DATE NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
      )
    `);

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS UTILITY_PAYMENTS (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        utility_type VARCHAR(50),
        payment_date DATE NOT NULL,
        due_date DATE NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
      )
    `);

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS INCOME_DEPOSITS (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        deposit_date DATE NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        source VARCHAR(100),
        source_name VARCHAR(255),
        created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
      )
    `);

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS SAVINGS_BALANCE (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        snapshot_date DATE NOT NULL,
        balance DECIMAL(12,2) NOT NULL,
        created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
      )
    `);

    await executeQuery(`
      CREATE TABLE IF NOT EXISTS SPENDING_TRANSACTIONS (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        transaction_date DATE NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(100),
        created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
      )
    `);

    console.log('✅ Schema created successfully');
    return { success: true, message: 'Schema initialized' };
  } catch (error) {
    console.error('❌ Schema initialization error:', error.message);
    return { success: false, error: error.message };
  }
}

// Insert demo data
export async function insertDemoData() {
  console.log('📦 Inserting demo data...');

  try {
    // Insert demo user
    await executeQuery(`
      MERGE INTO USERS AS target
      USING (SELECT 'demo-user' AS id, 'demo@credence.app' AS email, 'Demo User' AS name) AS source
      ON target.id = source.id
      WHEN NOT MATCHED THEN INSERT (id, email, name) VALUES (source.id, source.email, source.name)
    `);

    // Insert rent payments (demo data for past 6 months)
    const rentPayments = [
      ['rent-1', 'demo-user', '2025-08-01', '2025-08-01', 1500, 'on_time'],
      ['rent-2', 'demo-user', '2025-09-01', '2025-09-01', 1500, 'on_time'],
      ['rent-3', 'demo-user', '2025-10-03', '2025-10-01', 1500, 'late'],
      ['rent-4', 'demo-user', '2025-11-01', '2025-11-01', 1500, 'on_time'],
      ['rent-5', 'demo-user', '2025-12-01', '2025-12-01', 1500, 'on_time'],
      ['rent-6', 'demo-user', '2026-01-01', '2026-01-01', 1500, 'on_time'],
    ];

    for (const [id, userId, payDate, dueDate, amount, status] of rentPayments) {
      await executeQuery(`
        MERGE INTO RENT_PAYMENTS AS target
        USING (SELECT ? AS id, ? AS user_id, ? AS payment_date, ? AS due_date, ? AS amount, ? AS status) AS source
        ON target.id = source.id
        WHEN NOT MATCHED THEN INSERT (id, user_id, payment_date, due_date, amount, status) 
        VALUES (source.id, source.user_id, source.payment_date, source.due_date, source.amount, source.status)
      `, [id, userId, payDate, dueDate, amount, status]);
    }

    // Insert savings snapshots
    const savings = [
      ['sav-1', 'demo-user', '2025-08-15', 450],
      ['sav-2', 'demo-user', '2025-09-15', 520],
      ['sav-3', 'demo-user', '2025-10-15', 580],
      ['sav-4', 'demo-user', '2025-11-15', 640],
      ['sav-5', 'demo-user', '2025-12-15', 710],
      ['sav-6', 'demo-user', '2026-01-15', 780],
    ];

    for (const [id, userId, snapDate, balance] of savings) {
      await executeQuery(`
        MERGE INTO SAVINGS_BALANCE AS target
        USING (SELECT ? AS id, ? AS user_id, ? AS snapshot_date, ? AS balance) AS source
        ON target.id = source.id
        WHEN NOT MATCHED THEN INSERT (id, user_id, snapshot_date, balance) 
        VALUES (source.id, source.user_id, source.snapshot_date, source.balance)
      `, [id, userId, snapDate, balance]);
    }

    console.log('✅ Demo data inserted successfully');
    return { success: true, message: 'Demo data inserted' };
  } catch (error) {
    console.error('❌ Demo data insertion error:', error.message);
    return { success: false, error: error.message };
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
  insertDemoData,
};
