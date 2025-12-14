import express from "express";
import { logger, errorHandler } from "./middlewares/index.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
const app = express();

app.use(express.json());
app.use(logger);

app.use("/auth", authRouter);
app.use("/product", productRouter);
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use(errorHandler);

export { app };
