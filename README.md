# Expense Tracker Project

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
