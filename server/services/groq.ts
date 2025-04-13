import { Message } from "@shared/schema";

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1";

// Function to get AI response for a user message
export async function getAiResponse(message: string, messageHistory: Message[]): Promise<string> {
  try {
    // Convert our message format to OpenAI format
    const formattedMessages = messageHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add the new user message
    formattedMessages.push({
      role: "user",
      content: message
    });
    
    const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 800
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting AI response:", error);
    throw error;
  }
}

// Function to generate an image prompt based on conversation
export async function generateImagePrompt(messages: Message[]): Promise<string> {
  try {
    // Convert our message format to OpenAI format
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add system message to guide the prompt generation
    formattedMessages.unshift({
      role: "system",
      content: `You are an expert at creating detailed image prompts for AI art generation. 
      Analyze the conversation and create a single, richly detailed prompt that captures the 
      emotional essence and key themes. The prompt should be descriptive, evocative, and 
      specific enough to generate a meaningful painting. Focus on style, mood, colors, and 
      visual elements that represent the emotional context of the conversation.`
    });
    
    // Add a final user message requesting the prompt
    formattedMessages.push({
      role: "user",
      content: "Based on our conversation, create a detailed image prompt for an AI to generate a painting that captures the emotions and themes we discussed."
    });
    
    const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating image prompt:", error);
    throw error;
  }
}

// Function to generate images, titles and descriptions
export async function generateImages(prompt: string) {
  try {
    // Generate 3 variations using Groq API for image generation
    const images = await Promise.all(
      Array.from({ length: 3 }).map(async (_, index) => {
        // First generate the image
        const imageResponse = await fetch(`${GROQ_API_URL}/images/generations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "dalle-3",
            prompt: `${prompt} (Variation ${index + 1})`,
            n: 1,
            size: "1024x1024"
          })
        });
        
        if (!imageResponse.ok) {
          const errorData = await imageResponse.json();
          throw new Error(`Groq image API error: ${imageResponse.status} - ${JSON.stringify(errorData)}`);
        }
        
        const imageData = await imageResponse.json();
        const imageUrl = imageData.data[0].url;
        
        // Then generate a title and description for the image
        const titleResponse = await fetch(`${GROQ_API_URL}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              {
                role: "system",
                content: "You are an art curator who provides titles and short descriptions for paintings."
              },
              {
                role: "user",
                content: `Create a title and a short description (max 100 words) for a painting based on this prompt: '${prompt} (Variation ${index + 1})'. Respond in JSON format with 'title' and 'description' fields.`
              }
            ],
            temperature: 0.7,
            max_tokens: 250,
            response_format: { type: "json_object" }
          })
        });
        
        if (!titleResponse.ok) {
          const errorData = await titleResponse.json();
          throw new Error(`Groq API error: ${titleResponse.status} - ${JSON.stringify(errorData)}`);
        }
        
        const titleData = await titleResponse.json();
        const { title, description } = JSON.parse(titleData.choices[0].message.content);
        
        return {
          prompt,
          imageUrl,
          title,
          description
        };
      })
    );
    
    return images;
  } catch (error) {
    console.error("Error generating images:", error);
    throw error;
  }
}
