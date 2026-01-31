-- ============================================
-- CREDENCE FINANCIAL TRUST PLATFORM
-- Snowflake Schema Setup
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS CREDENCE_DB;
USE DATABASE CREDENCE_DB;

-- Create schema
CREATE SCHEMA IF NOT EXISTS PUBLIC;
USE SCHEMA PUBLIC;

-- ============================================
-- CORE TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS USERS (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
);

-- Rent payment history
CREATE TABLE IF NOT EXISTS RENT_PAYMENTS (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  payment_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'on_time', 'late', 'missed'
  property_type VARCHAR(50), -- 'apartment', 'house', 'room'
  source VARCHAR(100), -- 'plaid', 'manual', 'property_api'
  created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  
  CONSTRAINT fk_rent_user FOREIGN KEY (user_id) REFERENCES USERS(id)
);

-- Utility bill payments
CREATE TABLE IF NOT EXISTS UTILITY_PAYMENTS (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  utility_type VARCHAR(50) NOT NULL, -- 'electric', 'gas', 'water', 'internet', 'phone'
  payment_date DATE NOT NULL,
  due_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'on_time', 'late', 'missed'
  provider VARCHAR(100),
  source VARCHAR(100),
  created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  
  CONSTRAINT fk_utility_user FOREIGN KEY (user_id) REFERENCES USERS(id)
);

-- Income deposits (from payroll, gig work, etc.)
CREATE TABLE IF NOT EXISTS INCOME_DEPOSITS (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  deposit_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  source VARCHAR(100), -- 'direct_deposit', 'ach', 'check', 'gig'
  source_name VARCHAR(255), -- Employer name or gig platform
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  
  CONSTRAINT fk_income_user FOREIGN KEY (user_id) REFERENCES USERS(id)
);

-- Savings balance snapshots
CREATE TABLE IF NOT EXISTS SAVINGS_BALANCE (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  snapshot_date DATE NOT NULL,
  balance DECIMAL(12,2) NOT NULL,
  account_type VARCHAR(50), -- 'checking', 'savings', 'money_market'
  source VARCHAR(100),
  created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  
  CONSTRAINT fk_savings_user FOREIGN KEY (user_id) REFERENCES USERS(id)
);

-- Spending transactions (aggregated)
CREATE TABLE IF NOT EXISTS SPENDING_TRANSACTIONS (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  transaction_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100), -- 'groceries', 'dining', 'entertainment', 'shopping', 'bills'
  merchant_name VARCHAR(255),
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  
  CONSTRAINT fk_spending_user FOREIGN KEY (user_id) REFERENCES USERS(id)
);

-- Trust passports (generated shareable profiles)
CREATE TABLE IF NOT EXISTS TRUST_PASSPORTS (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  trust_score INTEGER NOT NULL,
  confidence_level VARCHAR(20) NOT NULL,
  summary VARIANT, -- JSON summary items
  created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  expires_at TIMESTAMP_NTZ NOT NULL,
  is_revoked BOOLEAN DEFAULT FALSE,
  
  CONSTRAINT fk_passport_user FOREIGN KEY (user_id) REFERENCES USERS(id)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_rent_user_date ON RENT_PAYMENTS(user_id, payment_date);
CREATE INDEX IF NOT EXISTS idx_utility_user_date ON UTILITY_PAYMENTS(user_id, payment_date);
CREATE INDEX IF NOT EXISTS idx_income_user_date ON INCOME_DEPOSITS(user_id, deposit_date);
CREATE INDEX IF NOT EXISTS idx_savings_user_date ON SAVINGS_BALANCE(user_id, snapshot_date);
CREATE INDEX IF NOT EXISTS idx_spending_user_date ON SPENDING_TRANSACTIONS(user_id, transaction_date);

-- ============================================
-- VIEWS FOR SCORING
-- ============================================

-- Payment reliability view
CREATE OR REPLACE VIEW V_PAYMENT_RELIABILITY AS
SELECT 
  user_id,
  COUNT(CASE WHEN status = 'on_time' THEN 1 END) as on_time_count,
  COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count,
  COUNT(CASE WHEN status = 'missed' THEN 1 END) as missed_count,
  COUNT(*) as total_count,
  ROUND(COUNT(CASE WHEN status = 'on_time' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) as reliability_score
FROM (
  SELECT user_id, status FROM RENT_PAYMENTS
  UNION ALL
  SELECT user_id, status FROM UTILITY_PAYMENTS
)
WHERE payment_date >= DATEADD(month, -12, CURRENT_DATE)
GROUP BY user_id;

-- Savings stability view
CREATE OR REPLACE VIEW V_SAVINGS_STABILITY AS
SELECT 
  user_id,
  FIRST_VALUE(balance) OVER (PARTITION BY user_id ORDER BY snapshot_date ASC) as first_balance,
  LAST_VALUE(balance) OVER (PARTITION BY user_id ORDER BY snapshot_date ASC 
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) as last_balance,
  AVG(balance) as avg_balance,
  MIN(balance) as min_balance,
  MAX(balance) as max_balance,
  STDDEV(balance) as balance_stddev
FROM SAVINGS_BALANCE
WHERE snapshot_date >= DATEADD(month, -6, CURRENT_DATE)
GROUP BY user_id, balance, snapshot_date;

-- Income consistency view
CREATE OR REPLACE VIEW V_INCOME_CONSISTENCY AS
SELECT 
  user_id,
  source,
  COUNT(DISTINCT DATE_TRUNC('month', deposit_date)) as months_with_income,
  SUM(amount) as total_income,
  AVG(amount) as avg_deposit,
  STDDEV(amount) as deposit_stddev,
  MIN(deposit_date) as first_deposit,
  MAX(deposit_date) as last_deposit
FROM INCOME_DEPOSITS
WHERE deposit_date >= DATEADD(month, -6, CURRENT_DATE)
GROUP BY user_id, source;

-- Spending volatility view
CREATE OR REPLACE VIEW V_SPENDING_VOLATILITY AS
WITH monthly_spending AS (
  SELECT 
    user_id,
    DATE_TRUNC('month', transaction_date) as month,
    SUM(amount) as monthly_spend
  FROM SPENDING_TRANSACTIONS
  WHERE transaction_date >= DATEADD(month, -6, CURRENT_DATE)
  GROUP BY user_id, DATE_TRUNC('month', transaction_date)
)
SELECT 
  user_id,
  AVG(monthly_spend) as avg_monthly_spend,
  STDDEV(monthly_spend) as spend_stddev,
  ROUND((STDDEV(monthly_spend) / NULLIF(AVG(monthly_spend), 0)) * 100, 2) as volatility_percent
FROM monthly_spending
GROUP BY user_id;

-- ============================================
-- DEMO DATA (for testing)
-- ============================================

-- Insert demo user
INSERT INTO USERS (id, email, name) VALUES 
  ('demo-user', 'demo@credence.app', 'Demo User')
ON CONFLICT (id) DO NOTHING;

-- Sample rent payments
INSERT INTO RENT_PAYMENTS (id, user_id, payment_date, due_date, amount, status) VALUES
  ('rent-1', 'demo-user', '2025-08-01', '2025-08-01', 1500, 'on_time'),
  ('rent-2', 'demo-user', '2025-09-01', '2025-09-01', 1500, 'on_time'),
  ('rent-3', 'demo-user', '2025-10-03', '2025-10-01', 1500, 'late'),
  ('rent-4', 'demo-user', '2025-11-01', '2025-11-01', 1500, 'on_time'),
  ('rent-5', 'demo-user', '2025-12-01', '2025-12-01', 1500, 'on_time'),
  ('rent-6', 'demo-user', '2026-01-01', '2026-01-01', 1500, 'on_time')
ON CONFLICT (id) DO NOTHING;

-- Sample savings snapshots
INSERT INTO SAVINGS_BALANCE (id, user_id, snapshot_date, balance) VALUES
  ('sav-1', 'demo-user', '2025-08-15', 450),
  ('sav-2', 'demo-user', '2025-09-15', 520),
  ('sav-3', 'demo-user', '2025-10-15', 580),
  ('sav-4', 'demo-user', '2025-11-15', 640),
  ('sav-5', 'demo-user', '2025-12-15', 710),
  ('sav-6', 'demo-user', '2026-01-15', 780)
ON CONFLICT (id) DO NOTHING;
