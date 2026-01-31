# Credence Backend

Financial Trust Platform API - Powered by Snowflake

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Required Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3001) |
| `JWT_SECRET` | Secret key for JWT tokens |
| `SNOWFLAKE_ACCOUNT` | Snowflake account identifier |
| `SNOWFLAKE_USERNAME` | Snowflake username |
| `SNOWFLAKE_PASSWORD` | Snowflake password |
| `SNOWFLAKE_DATABASE` | Database name |
| `SNOWFLAKE_WAREHOUSE` | Compute warehouse |
| `FRONTEND_URL` | Frontend URL for CORS |
| `USE_MOCK_DATA` | Set to 'true' for demo mode |

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/demo` - Demo mode login
- `GET /api/auth/verify` - Verify JWT token

### Reputation
- `GET /api/reputation/score` - Get trust score and pillars
- `GET /api/reputation/pillars` - Get pillar breakdown only
- `GET /api/reputation/history` - Get score history
- `GET /api/reputation/personas` - List demo personas

### Trust Passport
- `POST /api/passport/generate` - Generate new passport
- `GET /api/passport/:id` - Get passport by ID
- `DELETE /api/passport/:id` - Revoke passport

### Business View
- `GET /api/business/applicant/:id` - Get applicant assessment
- `GET /api/business/applicants` - List all applicants

### Insights
- `GET /api/insights/factors` - Get scoring factors
- `GET /api/insights/charts` - Get chart data
- `GET /api/insights/volatility` - Get volatility analysis

## Snowflake Schema

See `snowflake/schema.sql` for database setup.

## Deployment

### Railway
```bash
railway up
```

### Docker
```bash
docker build -t credence-api .
docker run -p 3001:3001 --env-file .env credence-api
```
