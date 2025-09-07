// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import "./config/passport.js";
import cookieParser from "cookie-parser";
import categoryRoutes from "./routes/category.route.js";

dotenv.config();
const app = express();

app.use(express.json({ limit: "10kb" }));
// app.use(helmet());
// // sanitize request data
// app.use(mongoSanitize());
// app.use(xss());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(
  session({
    secret: "oauth-temp-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
