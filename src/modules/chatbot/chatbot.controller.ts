import { NextFunction, Request, Response } from "express";
import { ChatbotService } from "./chatbot.service";

const MAX_MESSAGE_LENGTH = 1500;
const MAX_HISTORY_ITEMS = 12;
const MAX_HISTORY_CONTENT_LENGTH = 1000;

const chatWithAssistant = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { message, history } = req.body as {
      message?: string;
      history?: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "message is required",
      });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `message is too long. Max ${MAX_MESSAGE_LENGTH} characters allowed`,
      });
    }

    const validHistory = Array.isArray(history)
      ? history
          .slice(-MAX_HISTORY_ITEMS)
          .filter(
            (item) =>
              item?.content &&
              (item.role === "user" || item.role === "assistant"),
          )
          .map((item) => ({
            role: item.role,
            content: item.content.slice(0, MAX_HISTORY_CONTENT_LENGTH),
          }))
      : [];

    const reply = await ChatbotService.createChatCompletion([
      ...validHistory,
      { role: "user", content: message.trim() },
    ]);

    res.status(200).json({
      success: true,
      message: "Assistant response generated",
      data: {
        reply,
      },
    });
  } catch (error: any) {
    next(error);
  }
};

export const ChatbotController = {
  chatWithAssistant,
};
