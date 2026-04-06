# Expense Tracker Project

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) installed on your machine

### Running the App

1. Clone the repo

```bash
git clone <repo-url>
cd expense-tracker-backend
```

2. Create a `.env` file in the `expense-tracker-backend` folder

```
PORT=3001
POSTGRES_USER=expense_user
POSTGRES_PASSWORD=yourchosenpassword
POSTGRES_DB=expense_tracker
DATABASE_URL=postgresql://expense_user:yourchosenpassword@db:5432/expense_tracker
```

3. Start the app

```bash
docker compose up --build
```

4. Run database migrations

```bash
docker compose exec backend npx prisma migrate deploy
```

5. Test the API

```bash
curl http://localhost:3001/health
# Expected: {"status":"ok"}
```

### Stopping the App

```bash
docker compose down
```

## Data Model

### `users`

| Column  | Type    | Notes        |
| ------- | ------- | ------------ |
| `id`    | integer | primary key  |
| `name`  | string  | e.g. "Alice" |
| `email` | string  | unique       |

### `expenses`

| Column        | Type     | Notes                  |
| ------------- | -------- | ---------------------- |
| `id`          | integer  | primary key            |
| `description` | string   | e.g. "Groceries"       |
| `amount`      | decimal  | e.g. 54.30             |
| `paid_by`     | integer  | foreign key → users.id |
| `date`        | datetime | when it was added      |
