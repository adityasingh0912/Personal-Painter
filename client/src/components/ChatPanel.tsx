import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Send, Sparkles } from "lucide-react";

interface ChatPanelProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onGeneratePaintings: () => void;
  isGenerating: boolean;
}

export default function ChatPanel({ messages, setMessages, onGeneratePaintings, isGenerating }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim() === "") return;
    
    const userMessage: Message = {
      role: "user",
      content: inputValue,
      timestamp: Date.now(),
    };
    
    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Send message to AI
      const response = await apiRequest("POST", "/api/conversation/message", {
        message: userMessage.content,
        messages: [...messages, userMessage], // Include the new user message
      });
      
      const data = await response.json();
      
      // Hide typing indicator
      setIsTyping(false);
      
      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const isGenerateEnabled = messages.length >= 4; // At least 2 exchanges

  return (
    <div className="w-full md:w-1/2 lg:w-2/5 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh-120px)]">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Chat with AI</h2>
        <p className="text-sm text-gray-500">Discuss your emotions, experiences, or ideas for a personalized painting</p>
      </div>
      
      <div className="flex-grow overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(100vh - 260px)" }}>
        {messages.length === 0 ? (
          <div className="message ai-message mb-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-sm">AI</span>
              </div>
              <div className="ml-3 bg-gray-100 py-3 px-4 rounded-lg max-w-[85%]">
                <p className="text-gray-800">
                  Welcome to Personal Painter! Tell me about an emotion, experience, or idea you'd like to explore through art. 
                  I'll listen and create unique paintings inspired by our conversation.
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`message ${message.role === "user" ? "user-message" : "ai-message"} mb-4`}>
              {message.role === "user" ? (
                <div className="flex items-start justify-end">
                  <div className="bg-primary-100 py-3 px-4 rounded-lg max-w-[85%]">
                    <p className="text-gray-800">{message.content}</p>
                  </div>
                  <div className="ml-3 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-500 text-sm">You</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-sm">AI</span>
                  </div>
                  <div className="ml-3 bg-gray-100 py-3 px-4 rounded-lg max-w-[85%]">
                    <p className="text-gray-800">{message.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        
        {isTyping && (
          <div className="message ai-message mb-4">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-sm">AI</span>
              </div>
              <div className="ml-3 bg-gray-100 py-2 px-4 rounded-lg flex items-center">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "200ms" }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "400ms" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="px-6 py-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-end">
          <div className="relative flex-grow">
            <Textarea 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              className="resize-none py-2 px-3"
              placeholder="Type your message..."
              disabled={isTyping || isGenerating}
            />
          </div>
          <Button 
            type="submit" 
            className="ml-3 h-10"
            disabled={inputValue.trim() === "" || isTyping || isGenerating}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        <div className="mt-3 text-right">
          <Button 
            variant="outline"
            className="inline-flex items-center"
            onClick={onGeneratePaintings}
            disabled={!isGenerateEnabled || isTyping || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Paintings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
