import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import clerkWebhooks from "./controllers/clerkWebhooks.js";

connectDB();

const app = express();
app.use(cors());

// ✅ Clerk webhook (RAW BODY – must be before express.json)
app.use("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks);

// ✅ Normal JSON routes
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
