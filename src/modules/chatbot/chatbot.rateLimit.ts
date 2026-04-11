import { NextFunction, Request, Response } from "express";

const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

const requestStore = new Map<string, { count: number; resetAt: number }>();

export const chatbotRateLimit = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const now = Date.now();
  const key = req.ip || req.headers["x-forwarded-for"]?.toString() || "unknown";

  const current = requestStore.get(key);

  if (!current || now > current.resetAt) {
    requestStore.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return next();
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      message: "Too many chatbot requests. Please try again later.",
    });
  }

  current.count += 1;
  requestStore.set(key, current);
  next();
};
