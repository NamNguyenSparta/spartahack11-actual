# Credence Backend & Deployment Implementation Plan

## Overview
This plan covers building the Credence backend, integrating Snowflake for financial data, and deploying the full stack application.

---

## Phase 1: Backend Setup (Node.js + Express)

### 1.1 Backend Structure
```
backend/
├── src/
│   ├── index.js          # Express server entry
│   ├── routes/
│   │   ├── auth.js       # Authentication routes
│   │   ├── reputation.js # Trust score & pillars
│   │   ├── passport.js   # Trust Passport generation
│   │   └── business.js   # Business/underwriting APIs
│   ├── services/
│   │   ├── snowflake.js  # Snowflake connection & queries
│   │   ├── scoring.js    # Reputation scoring engine
│   │   └── passport.js   # Passport generation logic
│   ├── middleware/
│   │   └── auth.js       # JWT authentication
│   └── utils/
│       └── helpers.js
├── package.json
├── .env.example
└── Dockerfile
```

### 1.2 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User authentication |
| GET | `/api/reputation/score` | Get trust score |
| GET | `/api/reputation/pillars` | Get pillar breakdown |
| GET | `/api/reputation/history` | 6-month score trend |
| GET | `/api/insights/factors` | Get scoring factors |
| POST | `/api/passport/generate` | Generate Trust Passport |
| GET | `/api/passport/:id` | Get passport by ID |
| GET | `/api/business/applicant/:id` | Business view applicant data |

---

## Phase 2: Snowflake Integration

### 2.1 Data Schema
Snowflake tables for behavioral data:

```sql
-- RENT_PAYMENTS: Track rent payment history
CREATE TABLE RENT_PAYMENTS (
  user_id VARCHAR,
  payment_date DATE,
  due_date DATE,
  amount DECIMAL(10,2),
  status VARCHAR  -- 'on_time', 'late', 'missed'
);

-- UTILITY_PAYMENTS: Utility bill history
CREATE TABLE UTILITY_PAYMENTS (
  user_id VARCHAR,
  utility_type VARCHAR,
  payment_date DATE,
  due_date DATE,
  amount DECIMAL(10,2),
  status VARCHAR
);

-- INCOME_DEPOSITS: Income/payroll deposits
CREATE TABLE INCOME_DEPOSITS (
  user_id VARCHAR,
  deposit_date DATE,
  amount DECIMAL(10,2),
  source VARCHAR
);

-- SAVINGS_BALANCE: Monthly savings snapshots
CREATE TABLE SAVINGS_BALANCE (
  user_id VARCHAR,
  snapshot_date DATE,
  balance DECIMAL(10,2)
);

-- SPENDING_TRANSACTIONS: Spending behavior
CREATE TABLE SPENDING_TRANSACTIONS (
  user_id VARCHAR,
  transaction_date DATE,
  amount DECIMAL(10,2),
  category VARCHAR
);
```

### 2.2 Snowflake Queries for Scoring
```sql
-- Payment Reliability Score
SELECT 
  user_id,
  COUNT(CASE WHEN status = 'on_time' THEN 1 END) as on_time_count,
  COUNT(*) as total_count,
  ROUND(COUNT(CASE WHEN status = 'on_time' THEN 1 END) * 100.0 / COUNT(*), 2) as reliability_score
FROM (
  SELECT user_id, status FROM RENT_PAYMENTS
  UNION ALL
  SELECT user_id, status FROM UTILITY_PAYMENTS
)
WHERE payment_date >= DATEADD(month, -12, CURRENT_DATE)
GROUP BY user_id;

-- Savings Stability (6-month trend)
SELECT 
  user_id,
  ROUND(REGR_SLOPE(balance, DATEDIFF(day, MIN(snapshot_date) OVER (PARTITION BY user_id), snapshot_date)) * 30, 2) as monthly_growth,
  AVG(balance) as avg_balance
FROM SAVINGS_BALANCE
WHERE snapshot_date >= DATEADD(month, -6, CURRENT_DATE)
GROUP BY user_id;
```

---

## Phase 3: Deployment Architecture

### 3.1 Infrastructure
```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel (Frontend)                       │
│                    Next.js / React Static                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Railway / Render (Backend)                  │
│                    Node.js Express API                          │
│                                                                 │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│   │   Auth API   │    │ Scoring API  │    │ Passport API │     │
│   └──────────────┘    └──────────────┘    └──────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Snowflake Data Cloud                       │
│                   Financial Behavioral Data                     │
│                                                                 │
│   ┌────────────┐  ┌────────────┐  ┌────────────────────────┐   │
│   │ Payments   │  │ Income     │  │ Spending + Savings     │   │
│   └────────────┘  └────────────┘  └────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Deployment Platforms
- **Frontend**: Vercel (free tier, auto-deploys from GitHub)
- **Backend**: Railway or Render (free tier available)
- **Database**: Snowflake (partner credits available)

---

## Phase 4: Environment Variables

### Backend `.env`
```env
# Server
PORT=3001
NODE_ENV=production

# Snowflake
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USERNAME=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_DATABASE=CREDENCE_DB
SNOWFLAKE_SCHEMA=PUBLIC
SNOWFLAKE_WAREHOUSE=COMPUTE_WH

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://credence.vercel.app
```

### Frontend `.env`
```env
VITE_API_URL=https://credence-api.railway.app
```

---

## Phase 5: Implementation Order

### Step 1: Create Backend (Today)
- [ ] Initialize Node.js project
- [ ] Set up Express server
- [ ] Create Snowflake service
- [ ] Build scoring engine
- [ ] Create API routes

### Step 2: Connect Frontend to Backend
- [ ] Create API service in frontend
- [ ] Replace mock data with API calls
- [ ] Add loading states
- [ ] Handle errors

### Step 3: Deploy
- [ ] Push to GitHub
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Railway
- [ ] Configure environment variables
- [ ] Test full stack

### Step 4: Demo Data
- [ ] Populate Snowflake with demo data
- [ ] Create demo user accounts
- [ ] Test all personas

---

## Next Actions
1. Create backend folder structure
2. Set up Snowflake connection
3. Implement scoring APIs
4. Update frontend to use backend
5. Deploy to production
