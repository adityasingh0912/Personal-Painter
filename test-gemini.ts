import { GoogleGenerativeAI, Part, Content } from "@google/generative-ai"; // Import Content type as well
import * as dotenv from 'dotenv';

// Load environment variables from .env file in the project root
dotenv.config();

async function main() {
    console.log("test-gemini.ts: Starting standalone Gemini image test...");

    const geminiApiKey = process.env.Gemini_API_KEY;
    if (!geminiApiKey) {
        console.error("test-gemini.ts: Error - Gemini_API_KEY environment variable not found. Make sure it's set in your .env file.");
        return;
    }
    console.log("test-gemini.ts: Gemini_API_KEY found:", geminiApiKey.substring(0, 10) + "..."); // Log first few chars of API key

    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        console.log("test-gemini.ts: Calling Gemini API for image generation...");
        const result = await model.generateContent({
            contents: [{ // Use 'contents' - now with role
                role: "user", // **ADD ROLE: "user" HERE**
                parts: [{ text: "A vibrant watercolor painting of a sunflower field under a bright blue sky" }]
            } as Content], // Explicitly cast to Content type for clarity (optional)
        });
        const response = result.response;

        if (response.promptFeedback?.blockReason) {
            console.warn("test-gemini.ts: Image generation blocked:", response.promptFeedback);
        } else {
            console.log("test-gemini.ts: Image generation successful!");
            console.log("test-gemini.ts: Gemini API Re sponse:", response); // Log the full response
            console.log("test-gemini.ts: response.candidates[0].content:", response.candidates[0].content);  // **<--- ADDED LOGGING LINE**
            console.log("test-gemini.ts: response.candidates[0].content.parts:", response.candidates[0].content.parts); // **<--- ADDED LOGGING LINE**
        }

    } catch (error: any) {
        console.error("test-gemini.ts: Error during Gemini image generation:", error);
        console.error("test-gemini.ts: Raw Error Object:", error);
    }

    console.log("test-gemini.ts: Test finished.");
}

main();