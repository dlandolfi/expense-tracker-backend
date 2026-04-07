import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import expensesRoutes from "./routes/expenses";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/expenses", expensesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
