import express from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import config from "./config";
import { auth } from "./lib/auth";
import { AuthRouter } from "./modules/auth/auth.routes";
// import errorHandler from "./middlewares/globalErrorHandler";
// import { notFound } from "./middlewares/notFound";

const app = express();

app.use(
  cors({
    origin: config.APP_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use("/api/auth", AuthRouter);

app.all("/api/auth/*splat", toNodeHandler(auth));

//medicine
// app.use("/api/medicines");

// app.use("/api/orders");

// app.use("/api/seller");

// app.use("/api/admin");

// app.use(errorHandler);

// app.use(notFound);

export default app;
