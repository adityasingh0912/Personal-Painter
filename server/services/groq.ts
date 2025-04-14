import { Message } from "@shared/schema"; // Assuming you still need this, remove if not
import { GoogleGenAI, GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai"; // Keep Gemini imports for potential future use or if other parts rely on it
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration and Setup ---

// Get directory for .env file (go up two levels from current file)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');

console.log("GROQ.TS: Configuring dotenv...");
console.log(`GROQ.TS: dotenv path: ${envPath}`);
dotenv.config({ path: envPath });
console.log("GROQ.TS: dotenv configuration complete.");

// Debug: Check current working directory and API Keys
console.log(`GROQ.TS: Current working directory: ${process.cwd()}`);
console.log("GROQ.TS: process.env.Gemini_API_KEY (after dotenv):", process.env.Gemini_API_KEY);
console.log("GROQ.TS: process.env.STABILITY_API_KEY (after dotenv):", process.env.STABILITY_API_KEY); // For ModelsLab API

// API Keys and URLs - Fetch from environment variables
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GEMINI_API_KEY = process.env.Gemini_API_KEY; // Keep Gemini API key for potential future use
// **MODELS LAB API KEY is now used for image generation, using STABILITY_API_KEY env variable**
const MODELS_LAB_API_KEY = process.env.STABILITY_API_KEY;

const GROQ_API_URL = "https://api.groq.com/openai/v1";
// Gemini URLs and Model Names (Keep these, though not directly used for image generation now)
const GEMINI_IMAGE_MODEL_NAME = "gemini-pro-vision"; // Kept for reference
const GEMINI_TEXT_MODEL_NAME = "gemini-1.5-flash";    // Kept for reference
const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com"; // Kept for reference


// Initialize Gemini GenAI client - outside functions (Keep this initialization, even if not directly used for image gen now)
let genAI: GoogleGenAI | null = null;

console.log("GROQ.TS: Gemini GoogleGenAI client initialization (even if not directly used for image gen)...");
if (GEMINI_API_KEY) {
    console.log("GROQ.TS: Gemini API key found. Initializing Gemini client...");
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log("GROQ.TS: Gemini GoogleGenAI client initialized successfully.");
} else {
    console.warn("GROQ.TS: Gemini API key NOT FOUND. Gemini client not initialized (image features disabled if relying on Gemini).");
}


// --- AI Response Function (Text using Groq - UNCHANGED) ---
export async function getAiResponse(message: string, messageHistory: Message[]): Promise<string> {
    try {
        console.log("GROQ.TS: getAiResponse - using Groq API for text response.");

        const formattedMessages = messageHistory.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
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
                model: "llama-3.3-70b-specdec", // Using specdec for chat - you can adjust model
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful and concise chat assistant. Respond briefly in 1-2 lines max.`
                    },
                    ...formattedMessages
                ],
                temperature: 0.7,
                max_tokens: 200
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Groq API error (Chat): ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error("GROQ.TS: Error in getAiResponse:", error);
        throw error;
    }
}


// --- Image Prompt Generation Function (Text using Groq - UNCHANGED) ---
export async function generateImagePrompt(messages: Message[]): Promise<string> {
    try {
        console.log("GROQ.TS: generateImagePrompt - using Groq API for prompt generation.");

        const formattedMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        formattedMessages.unshift({
            role: "system",
            content: `You are an expert AI art prompt creator. Analyze the conversation and create ONE detailed, evocative prompt capturing the emotional essence and themes. Focus on style, mood, colors, visual elements.`
        });
        formattedMessages.push({
            role: "user",
            content: "Create a detailed image prompt for AI art based on our conversation."
        });

        const response = await fetch(`${GROQ_API_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile", // Using versatile for prompt generation - adjust if needed
                messages: formattedMessages,
                temperature: 0.7,
                max_tokens: 400
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Groq API error (Prompt Gen): ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        let promptText = data.choices[0].message.content;
        promptText = promptText.replace(/^```json\s*|```$/g, '').trim(); // Clean up markdown
        promptText = promptText.replace(/^```\s*|```$/g, '').trim();
        promptText = promptText.replace(/^Prompt:\s*/i, '').trim();
        return promptText;

    } catch (error) {
        console.error("GROQ.TS: Error in generateImagePrompt:", error);
        throw error;
    }
}


// --- Image Generation, Title, and Description Function (Images with ModelsLab, Text with Groq) ---
export async function generateImages(prompt: string): Promise<any[]> { // Return type 'any[]' for flexibility
    try {
        console.log("GROQ.TS: generateImages - using ModelsLab API for image generation.");

        const images = await Promise.all(
            Array.from({ length: 3 }).map(async (_, index) => {
                const variationPrompt = `${prompt} (Variation ${index + 1})`;
                console.log(`GROQ.TS: Requesting ModelsLab image (text2img) - Prompt: ${variationPrompt}`);

                try {
                    // --- ModelsLab Image Generation using fetch API ---
                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    // **Use ModelsLab API Key from environment variable**
                    const MODELS_LAB_API_KEY = process.env.STABILITY_API_KEY; // Assuming you are using STABILITY_API_KEY for ModelsLab

                    if (!MODELS_LAB_API_KEY) {
                        throw new Error("GROQ.TS: ModelsLab API key (STABILITY_API_KEY) not found in environment.");
                    }

                    var raw = JSON.stringify({
                        "key": MODELS_LAB_API_KEY, // Use API key from env variable
                        "prompt": variationPrompt, // Use variation prompt
                        "negative_prompt": "bad quality",
                        "width": "512",
                        "height": "512",
                        "safety_checker": false,
                        "seed": null,
                        "samples": 1,
                        "base64": false,
                        "webhook": null,
                        "track_id": null
                    });

                    const requestOptions: RequestInit = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    };

                    const response = await fetch("https://modelslab.com/api/v6/realtime/text2img", requestOptions);

                    if (!response.ok) {
                        const errorText = await response.text(); // Get error text for ModelsLab errors
                        throw new Error(`GROQ.TS: ModelsLab API error (text2img): ${response.status} - ${errorText}`);
                    }

                    const modelsLabData = await response.json();
                    // **Debug: Log the ModelsLab API response**
                    console.log("GROQ.TS: ModelsLab API Response:", modelsLabData);

                    let imageUrl = "";
                    // **Correctly extract image URL from ModelsLab response - using 'output' array**
                    if (modelsLabData && modelsLabData.status === "success" && modelsLabData.output && modelsLabData.output.length > 0) {
                        imageUrl = modelsLabData.output[0]; // Image URL is directly in modelsLabData.output[0]
                        console.log(`GROQ.TS: Generated image URL (ModelsLab): ${imageUrl.substring(0, 100)}...`);
                    } else {
                        console.error("GROQ.TS: No image URL found in ModelsLab API response.");
                        console.error("GROQ.TS: Raw ModelsLab API Response (for debugging):", modelsLabData);
                        throw new Error("GROQ.TS: No image URL in ModelsLab response");
                    }


                    // --- Title and Description Generation using Groq API (No changes needed from before) ---
                    const titleResponse = await fetch(`${GROQ_API_URL}/chat/completions`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${GROQ_API_KEY}`
                        },
                        body: JSON.stringify({
                            model: "llama-3.3-70b-versatile", // Using versatile for title/desc - adjust if needed
                            messages: [{
                                role: "user",
                                content: `Create a concise title and a short description (1 sentences) for an image with the prompt: "${variationPrompt}" Respond in JSON format: {"title": "...", "description": "..."}`
                            }],
                            temperature: 0.8,
                            max_tokens: 200
                        })
                    });
                    const titleData = await titleResponse.json();

                    // --- ADDED MARKDOWN CLEANUP HERE ---
                    let rawTitleDescription = titleData.choices[0].message.content;
                    rawTitleDescription = rawTitleDescription.replace(/^```json\s*|```$/g, '').trim(); // Clean up markdown
                    rawTitleDescription = rawTitleDescription.replace(/^```\s*|```$/g, '').trim();


                    // --- ADDED LOGGING HERE (to see cleaned response) ---
                    console.log("GROQ.TS: Raw title/description response from Groq (cleaned):", rawTitleDescription);


                    let title = "Generated Title"; // Default values in case parsing fails
                    let description = "Generated Description";
                    try {
                        const parsedTitleData = JSON.parse(rawTitleDescription); // Parse the cleaned response
                        title = parsedTitleData.title || title; // Use parsed title or default
                        description = parsedTitleData.description || description; // Use parsed description or default
                    } catch (parseError) {
                        console.error("GROQ.TS: Error parsing title/description JSON:", parseError);
                        // Use default title/description if parsing fails
                    }


                    return {
                        prompt: variationPrompt,
                        imageUrl,
                        title,
                        description
                    };

                } catch (modelsLabImageError: any) {
                    console.error(`GROQ.TS: ModelsLab API Error (text2img):`, modelsLabImageError);
                    console.log("GROQ.TS: Raw ModelsLab API Error Object:", modelsLabImageError); // Log raw error for debugging
                    throw new Error(`GROQ.TS: ModelsLab API Error (text2img): ${modelsLabImageError.message}`);
                }
            })
        );

        return images;

    } catch (error) {
        console.error("GROQ.TS: Error in generateImages function (ModelsLab version):", error);
        throw error;
    }
}