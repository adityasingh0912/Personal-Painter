import { Router } from "express";
import { IStorage } from "../storage";
import { z } from "zod";
import { messagesArraySchema } from "@shared/schema";
import { getAiResponse, generateImagePrompt, generateImages } from "../services/groq";

// Validation schema for message request
const messageRequestSchema = z.object({
  message: z.string().min(1),
  messages: messagesArraySchema,
});

// Validation schema for generate request
const generateRequestSchema = z.object({
  messages: messagesArraySchema,
});

export function registerConversationRoutes(storage: IStorage) {
  const router = Router();
  
  // POST /api/conversation/message - Send a message to the AI
  router.post("/message", async (req, res) => {
    try {
      // Validate request body
      const validation = messageRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validation.error.format(),
        });
      }
      
      const { message, messages } = validation.data;
      
      // Get response from AI
      const aiResponse = await getAiResponse(message, messages);
      
      return res.json({ message: aiResponse });
    } catch (error) {
      console.error("Error in message endpoint:", error);
      return res.status(500).json({
        message: "Failed to get AI response",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
  
  // POST /api/conversation/generate - Generate paintings from the conversation
  router.post("/generate", async (req, res) => {
    try {
      // Validate request body
      const validation = generateRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validation.error.format(),
        });
      }
      
      const { messages } = validation.data;
      
      // Generate an image prompt based on the conversation
      const prompt = await generateImagePrompt(messages);
      
      // Generate images using the prompt
      const paintingsData = await generateImages(prompt);
      
      // Save conversation and paintings
      const conversationId = await storage.createConversation({
        title: "Conversation " + new Date().toLocaleDateString(),
        messages: messages,
      });
      
      const paintings = await Promise.all(
        paintingsData.map(painting => 
          storage.createPainting({
            ...painting,
            conversationId,
          })
        )
      );
      
      return res.json({
        prompt,
        paintings,
      });
    } catch (error) {
      console.error("Error in generate endpoint:", error);
      return res.status(500).json({
        message: "Failed to generate paintings",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
  
  return router;
}
