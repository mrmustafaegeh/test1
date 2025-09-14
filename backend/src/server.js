import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import imageRoute from "./routes/image.route.js";
import storeFrontRoute from "./routes/storefront.route.js";
import { protectRoute } from "./middlewares/auth.middleware.js";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve the real image files under /api/images
const imagePath = path.join(__dirname, "..", "..", "images");
app.use("/api/images", express.static(imagePath));

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend origin
    credentials: true, // If you're using cookies/auth
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

app.use("/api/auth", authRoute);
app.use("/api/image", protectRoute, imageRoute);
app.use("/api/storefront", storeFrontRoute);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
