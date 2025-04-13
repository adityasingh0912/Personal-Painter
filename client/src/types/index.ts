export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface Painting {
  id: number;
  conversationId?: number;
  prompt: string;
  imageUrl: string;
  title: string;
  description: string;
  createdAt?: string;
}

export interface ConversationResponse {
  message: string;
}

export interface GeneratePaintingsResponse {
  paintings: Painting[];
  prompt: string;
}
