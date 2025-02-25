# Stock Trading Service

A NestJS-based service for managing stock transactions and user portfolios.

## Prerequisites

- Node.js (v20.18 or higher)
- npm (v10 or higher)
- Docker with docker-compose for PostgreSQL

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd stock-trading-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Edit `.env` with your configuration:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stock_trading_db"
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-specific-password
   DEFAULT_REPORT_EMAIL=default-recipient@example.com
   ```

4. Run docker-compose to start PostgreSQL:

   ```bash
   docker-compose up -d
   ```

5. Run database migrations:

   ```bash
   npm run prisma:migrate
   ```

6. Seed the database:

   ```bash
   npm run seed
   ```

7. Start the application:

   ```bash
   npm run start:dev
   ```

## Running the Application

Development mode:

## Testing

Run unit tests:

```bash
npm run test
```

Run tests with coverage:

```bash
npm run test:cov
```

The project includes comprehensive unit tests for:

- Controllers (user, stock, transaction)
- Services (user, stock, transaction)
- Repositories (user, transaction)
- Email service

Coverage configuration excludes:

- DTOs
- Module files
- Main.ts
- Index files

## API Documentation

Once the application is running, visit:

- Swagger UI: `http://localhost:3000/api/v1/docs`

## Features

- User management (CRUD operations)
- Stock portfolio tracking
- Buy stock transactions
- Daily transaction reports
- Email notifications

## API Endpoints

### Users

- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Stocks

- `GET /stock` - Get available stocks
- `GET /stock/portfolio/:userId` - Get user's portfolio
- `POST /stock/:symbol/buy` - Buy stock

### Transactions

- `GET /transactions/daily` - Get daily transactions

## Environment Variables

| Variable             | Description                  | Default        |
| -------------------- | ---------------------------- | -------------- |
| DATABASE_URL         | PostgreSQL connection string | -              |
| SMTP_HOST            | SMTP server host             | smtp.gmail.com |
| SMTP_PORT            | SMTP server port             | 587            |
| SMTP_USER            | SMTP username                | -              |
| SMTP_PASS            | SMTP password                | -              |
| DEFAULT_REPORT_EMAIL | Default email for reports    | -              |

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 400: Bad Request
- 404: Not Found
- 500: Server Error
