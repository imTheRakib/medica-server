import { Router } from "express";
import { ChatbotController } from "./chatbot.controller";
import { chatbotRateLimit } from "./chatbot.rateLimit";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Chatbot module is healthy",
  });
});

router.post("/chat", chatbotRateLimit, ChatbotController.chatWithAssistant);

export const ChatbotRouter = router;
