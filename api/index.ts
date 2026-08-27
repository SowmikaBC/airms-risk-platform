import express from "express";
import cors from "cors";
import { registerRoutes } from "../server/routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

registerRoutes(app);

export default app;
