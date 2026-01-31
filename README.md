# Credence - Financial Trust Platform

> Built for the credit invisible. Share proof of reliability, not your bank history.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/credence)
[![Deploy Backend](https://railway.app/button.svg)](https://railway.app/new/template)

## 🚀 Overview

Credence is a financial reputation platform that helps individuals with limited credit history prove their financial reliability. Perfect for students, immigrants, and freelancers who need to demonstrate trustworthiness to landlords, lenders, and services.

### Key Features

- **Trust Score (0-100)** - Comprehensive financial reliability metric
- **Reputation Pillars** - Payment Reliability, Savings Stability, Income Consistency, Spending Stability
- **Trust Passport** - Shareable, privacy-safe reputation summary
- **Business View** - Underwriting dashboard for landlords/lenders
- **Snowflake Integration** - Real-time financial data analysis

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Frontend (Vercel)             │
│        React + Vite + Recharts          │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│        Backend (Railway/Render)         │
│        Node.js + Express API            │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│        Snowflake Data Cloud             │
│     Financial Behavioral Data           │
└─────────────────────────────────────────┘
```

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Snowflake account (optional for demo mode)

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/credence.git
cd credence

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### Development

```bash
# Run frontend only
npm run dev

# Run backend only
npm run dev:backend

# Run both (full stack)
npm run dev:all
```

### Build

```bash
# Build frontend
npm run build

# Build all
npm run build:all
```

## 🔧 Configuration

### Frontend Environment
Create `.env` in root:
```env
VITE_API_URL=http://localhost:3001
```

### Backend Environment
Create `backend/.env`:
```env
PORT=3001
JWT_SECRET=your_secret_key
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USERNAME=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_DATABASE=CREDENCE_DB
USE_MOCK_DATA=true
```

## 🚢 Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variable:
   - `VITE_API_URL` = Your backend URL

### Backend → Railway

1. Create new Railway project
2. Connect GitHub repo
3. Set root directory: `backend`
4. Add environment variables
5. Deploy!

### Snowflake Setup

Run the schema file in Snowflake:
```bash
# Connect to Snowflake and run:
backend/snowflake/schema.sql
```

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/reputation/score` | GET | Get trust score |
| `/api/reputation/pillars` | GET | Pillar breakdown |
| `/api/passport/generate` | POST | Create passport |
| `/api/business/applicant/:id` | GET | Underwriting data |
| `/api/insights/factors` | GET | Scoring factors |

## 🎯 Demo Mode

Enable demo mode by setting `USE_MOCK_DATA=true` in backend. This uses mock personas:

- **🎓 Responsible Student** - Score: 84, Low Risk
- **💼 Volatile Freelancer** - Score: 58, Medium Risk
- **⭐ Perfect Payer** - Score: 76, Low-Medium Risk

## 📄 License

MIT

---

Built with ❤️ for SpartaHack 11
