import express from "express";
// import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import config from "./config";
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

// app.all("/api/auth/*splat", toNodeHandler(auth));

// app.use(errorHandler);

// app.use(notFound);

export default app;
