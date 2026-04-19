import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import expensesRoutes from "./routes/expenses";
import balanceRoutes from "./routes/balance";
import userRoutes from "./routes/users";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: false
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/expenses", expensesRoutes);
app.use("/balance", balanceRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
