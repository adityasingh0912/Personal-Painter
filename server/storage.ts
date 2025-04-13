import { 
  type User, 
  type InsertUser, 
  type Conversation, 
  type InsertConversation, 
  type Painting, 
  type InsertPainting, 
  type Message 
} from "@shared/schema";

// Storage interface with all the necessary CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Conversation methods
  getConversation(id: number): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation): Promise<number>;
  
  // Painting methods
  getPaintingsByConversationId(conversationId: number): Promise<Painting[]>;
  createPainting(painting: InsertPainting): Promise<Painting>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversations: Map<number, Conversation>;
  private paintings: Map<number, Painting>;
  private userIdCounter: number;
  private conversationIdCounter: number;
  private paintingIdCounter: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.paintings = new Map();
    this.userIdCounter = 1;
    this.conversationIdCounter = 1;
    this.paintingIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Conversation methods
  async getConversation(id: number): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }
  
  async getAllConversations(): Promise<Conversation[]> {
    return Array.from(this.conversations.values());
  }
  
  async createConversation(insertConversation: InsertConversation): Promise<number> {
    const id = this.conversationIdCounter++;
    const createdAt = new Date().toISOString();
    
    const conversation: Conversation = { 
      ...insertConversation, 
      id, 
      createdAt 
    };
    
    this.conversations.set(id, conversation);
    return id;
  }
  
  // Painting methods
  async getPaintingsByConversationId(conversationId: number): Promise<Painting[]> {
    return Array.from(this.paintings.values()).filter(
      (painting) => painting.conversationId === conversationId
    );
  }
  
  async createPainting(insertPainting: InsertPainting): Promise<Painting> {
    const id = this.paintingIdCounter++;
    const createdAt = new Date().toISOString();
    
    const painting: Painting = {
      ...insertPainting,
      id,
      createdAt
    };
    
    this.paintings.set(id, painting);
    return painting;
  }
}

// Export instance of MemStorage
export const storage = new MemStorage();
