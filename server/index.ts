import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Register REST API endpoints
registerRoutes(app);

// In production, serve built frontend assets
if (process.env.NODE_ENV === "production") {
  let publicPath = path.resolve(__dirname, "../dist");
  if (fs.existsSync(path.resolve(__dirname, "../dist/public"))) {
    publicPath = path.resolve(__dirname, "../dist/public");
  }
  app.use(express.static(publicPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`[AIRMS] Risk Platform Server running on port ${PORT}`);
});
