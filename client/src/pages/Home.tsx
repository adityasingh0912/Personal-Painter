import { useState } from "react";
import Header from "@/components/Header";
import ChatPanel from "@/components/ChatPanel";
import GalleryPanel from "@/components/GalleryPanel";
import { Message, Painting, ConversationStatus } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { generatePaintings } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: "1",
    content: "Hello! I'm your Personal Painter. I'd love to create art that resonates with you. Tell me about an emotion, experience, or idea that's meaningful to you.",
    sender: "ai",
    timestamp: new Date(),
  }]);

  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [conversationStatus, setConversationStatus] = useState<ConversationStatus>("active");
  const { toast } = useToast();

  const { mutate: generate, isPending: isGenerating } = useMutation({
    mutationFn: () => generatePaintings(messages),
    onSuccess: (data) => {
      setPaintings(data);
      setConversationStatus("completed");
      
      // Add a completion message
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "I've created three personalized paintings inspired by our conversation. You can view them in the gallery panel.",
          sender: "ai",
          timestamp: new Date(),
        }
      ]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to generate paintings: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
      setConversationStatus("active");
    }
  });

  const addMessage = async (content: string, sender: "user" | "ai") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    
    if (sender === "user") {
      try {
        const response = await apiRequest("POST", "/api/chat", { message: content });
        const data = await response.json();
        
        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            content: data.response,
            sender: "ai",
            timestamp: new Date(),
          }
        ]);
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to get AI response: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        });
      }
    }
  };

  const startNewConversation = () => {
    setMessages([{
      id: "1",
      content: "Hello! I'm your Personal Painter. I'd love to create art that resonates with you. Tell me about an emotion, experience, or idea that's meaningful to you.",
      sender: "ai",
      timestamp: new Date(),
    }]);
    setPaintings([]);
    setConversationStatus("active");
  };

  return (
    <div className="flex flex-col h-screen">
      <Header onNewPainting={startNewConversation} />
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <ChatPanel 
          messages={messages} 
          onSendMessage={content => addMessage(content, "user")}
          onGeneratePaintings={generate}
          conversationStatus={conversationStatus}
          isGenerating={isGenerating}
        />
        <GalleryPanel 
          paintings={paintings} 
          onStartChat={() => document.getElementById("message-input")?.focus()}
        />
      </main>
    </div>
  );
};

export default Home;
