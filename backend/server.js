import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});