import "dotenv/config";
import express from "express";
import { logger, errorHandler } from "./middlewares/index.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import stockRouter from "./routes/stock.route.js";
import salesRouter from "./routes/sales.route.js";
import summaryRouter from "./routes/summary.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(logger);
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/stock", stockRouter);
app.use("/sales", salesRouter);
app.use("/summary", summaryRouter);

app.use(errorHandler);

export { app };
