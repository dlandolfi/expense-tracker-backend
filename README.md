# Expense Tracker — Backend

A REST API for a shared two-user expense tracker. Built with Express.js and TypeScript, backed by PostgreSQL, and containerized with Docker.

## Tech Stack

- [Express.js](https://expressjs.com/) — REST API framework
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [PostgreSQL](https://www.postgresql.org/) — Database
- [Prisma](https://www.prisma.io/) — ORM and migrations
- [Docker](https://www.docker.com/) — Containerization
- [Zod](https://zod.dev/) — Request validation
- [Winston](https://github.com/winstonjs/winston) — Structured JSON logging
- [Helmet](https://helmetjs.github.io/) — HTTP security headers
- [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest) — Testing

## API Routes

### Users

| Method | Endpoint | Description     |
| ------ | -------- | --------------- |
| `GET`  | `/users` | Fetch all users |

### Expenses

| Method   | Endpoint                  | Description             |
| -------- | ------------------------- | ----------------------- |
| `GET`    | `/expenses`               | Fetch all expenses      |
| `GET`    | `/expenses?month=YYYY-MM` | Fetch expenses by month |
| `POST`   | `/expenses`               | Add a new expense       |
| `PUT`    | `/expenses/:id`           | Update an expense       |
| `DELETE` | `/expenses/:id`           | Delete an expense       |

### Balance

| Method | Endpoint                 | Description                         |
| ------ | ------------------------ | ----------------------------------- |
| `GET`  | `/balance`               | Get running total and who owes what |
| `GET`  | `/balance?month=YYYY-MM` | Get balance for a specific month    |

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed on your machine

### Running Locally

1. Clone the repo

```bash
git clone <repo-url>
cd expense-tracker-backend
```

2. Create a `.env` file

```
PORT=3001
POSTGRES_USER=expense_user
POSTGRES_PASSWORD=yourchosenpassword
POSTGRES_DB=expense_tracker
DATABASE_URL=postgresql://expense_user:yourchosenpassword@db:5432/expense_tracker
TEST_DATABASE_URL=postgresql://expense_user:yourchosenpassword@localhost:5432/expense_tracker_test
```

3. Start the app

```bash
docker compose up --build
```

4. Run database migrations

```bash
docker compose exec backend npx prisma migrate deploy
```

5. Seed users

```bash
docker compose exec db psql -U expense_user -d expense_tracker
```

```sql
INSERT INTO "User" (name, email) VALUES ('User1', 'user1@example.com');
INSERT INTO "User" (name, email) VALUES ('User2', 'user2@example.com');
```

6. Test the API

```bash
curl http://localhost:3001/health
# Expected: {"status":"ok"}
```

### Running Tests

```bash
npm test
```

### Stopping the App

```bash
docker compose down
```

## CI/CD

GitHub Actions runs the linter and full test suite on every pull request.
