import { Message } from "@/types";

// The base URL for the API
const API_BASE_URL = "";

// Create a function to handle API errors
function handleErrors(response: Response) {
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// Chat API functions
export async function sendMessage(message: string, messageHistory: Message[]) {
  const response = await fetch(`${API_BASE_URL}/api/conversation/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, messages: messageHistory }),
  });
  
  return handleErrors(response);
}

// Generate paintings API function
export async function generatePaintings(messages: Message[]) {
  const response = await fetch(`${API_BASE_URL}/api/conversation/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  });
  
  return handleErrors(response);
}
