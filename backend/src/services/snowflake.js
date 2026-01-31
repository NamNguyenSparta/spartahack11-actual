import snowflake from 'snowflake-sdk';
import dotenv from 'dotenv';

dotenv.config();

let connection = null;

// Create Snowflake connection
export async function connectSnowflake() {
    return new Promise((resolve, reject) => {
        if (connection) {
            resolve(connection);
            return;
        }

        const conn = snowflake.createConnection({
            account: process.env.SNOWFLAKE_ACCOUNT,
            username: process.env.SNOWFLAKE_USERNAME,
            password: process.env.SNOWFLAKE_PASSWORD,
            database: process.env.SNOWFLAKE_DATABASE,
            schema: process.env.SNOWFLAKE_SCHEMA,
            warehouse: process.env.SNOWFLAKE_WAREHOUSE,
            role: process.env.SNOWFLAKE_ROLE,
        });

        conn.connect((err, conn) => {
            if (err) {
                console.error('Failed to connect to Snowflake:', err);
                reject(err);
            } else {
                console.log('✅ Connected to Snowflake');
                connection = conn;
                resolve(conn);
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
                    reject(err);
                } else {
                    resolve(rows);
                }
            }
        });
    });
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
    )
    WHERE payment_date >= DATEADD(month, -12, CURRENT_DATE)
  `;

    const rows = await executeQuery(sql, [userId, userId]);
    return rows[0] || { on_time_count: 0, total_count: 0, score: 0 };
}

// Get savings stability data
export async function getSavingsStability(userId) {
    const sql = `
    SELECT 
      ROUND(
        (LAST_VALUE(balance) OVER (ORDER BY snapshot_date) - 
         FIRST_VALUE(balance) OVER (ORDER BY snapshot_date)) / 
        NULLIF(FIRST_VALUE(balance) OVER (ORDER BY snapshot_date), 0) * 100, 1
      ) as growth_percent,
      AVG(balance) as avg_balance,
      MIN(balance) as min_balance,
      MAX(balance) as max_balance
    FROM SAVINGS_BALANCE
    WHERE user_id = ?
      AND snapshot_date >= DATEADD(month, -6, CURRENT_DATE)
    GROUP BY user_id
  `;

    const rows = await executeQuery(sql, [userId]);
    return rows[0] || { growth_percent: 0, avg_balance: 0 };
}

// Get income consistency data
export async function getIncomeConsistency(userId) {
    const sql = `
    SELECT 
      COUNT(DISTINCT DATE_TRUNC('month', deposit_date)) as months_with_income,
      AVG(amount) as avg_deposit,
      STDDEV(amount) as deposit_stddev,
      source
    FROM INCOME_DEPOSITS
    WHERE user_id = ?
      AND deposit_date >= DATEADD(month, -6, CURRENT_DATE)
    GROUP BY user_id, source
  `;

    const rows = await executeQuery(sql, [userId]);
    return rows[0] || { months_with_income: 0, avg_deposit: 0 };
}

// Get spending stability data
export async function getSpendingStability(userId) {
    const sql = `
    SELECT 
      AVG(monthly_spend) as avg_monthly_spend,
      STDDEV(monthly_spend) as spend_stddev,
      ROUND((STDDEV(monthly_spend) / NULLIF(AVG(monthly_spend), 0)) * 100, 1) as volatility_percent
    FROM (
      SELECT 
        DATE_TRUNC('month', transaction_date) as month,
        SUM(amount) as monthly_spend
      FROM SPENDING_TRANSACTIONS
      WHERE user_id = ?
        AND transaction_date >= DATEADD(month, -6, CURRENT_DATE)
      GROUP BY DATE_TRUNC('month', transaction_date)
    )
  `;

    const rows = await executeQuery(sql, [userId]);
    return rows[0] || { avg_monthly_spend: 0, volatility_percent: 0 };
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
    )
    WHERE payment_date >= DATEADD(month, -6, CURRENT_DATE)
    GROUP BY DATE_TRUNC('month', payment_date)
    ORDER BY DATE_TRUNC('month', payment_date)
  `;

    const rows = await executeQuery(sql, [userId, userId]);
    return rows;
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

    const rows = await executeQuery(sql, [userId]);
    return rows;
}

export default {
    connectSnowflake,
    executeQuery,
    getPaymentReliability,
    getSavingsStability,
    getIncomeConsistency,
    getSpendingStability,
    getPaymentHistory,
    getSavingsHistory,
};
