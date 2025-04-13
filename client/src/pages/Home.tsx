import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatPanel from "@/components/ChatPanel";
import GalleryPanel from "@/components/GalleryPanel";
import { Message, Painting } from "@/types";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to Personal Painter! Tell me about an emotion, experience, or idea you'd like to explore through art. I'll listen and create unique paintings inspired by our conversation.",
      timestamp: Date.now(),
    },
  ]);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [prompt, setPrompt] = useState("");
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [generatingStatus, setGeneratingStatus] = useState("");
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async () => {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGeneratingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
        
        const statuses = [
          "Analyzing conversation...",
          "Crafting painting prompt...",
          "Generating artwork...",
          "Adding final touches..."
        ];
        
        const statusIndex = Math.floor((generatingProgress / 100) * statuses.length);
        setGeneratingStatus(statuses[Math.min(statusIndex, statuses.length - 1)]);
      }, 1500);
      
      // Make the actual API request
      const response = await apiRequest("POST", "/api/conversation/generate", {
        messages,
      });
      
      clearInterval(progressInterval);
      setGeneratingProgress(100);
      setGeneratingStatus("Complete!");
      
      return response.json();
    },
    onSuccess: (data) => {
      setPaintings(data.paintings);
      setPrompt(data.prompt);
      toast({
        title: "Success",
        description: "Your paintings have been created!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate paintings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNewSession = () => {
    setMessages([
      {
        role: "assistant",
        content: "Welcome to Personal Painter! Tell me about an emotion, experience, or idea you'd like to explore through art. I'll listen and create unique paintings inspired by our conversation.",
        timestamp: Date.now(),
      },
    ]);
    setPaintings([]);
    setPrompt("");
    setGeneratingProgress(0);
    setGeneratingStatus("");
  };

  const handleGeneratePaintings = () => {
    if (messages.length < 4) {
      toast({
        title: "Not enough conversation",
        description: "Please chat a bit more to generate better paintings.",
        variant: "destructive",
      });
      return;
    }
    
    generateMutation.mutate();
  };

  return (
    <div className="w-full h-full flex flex-col min-h-screen">
      <Header onNewSession={handleNewSession} />
      
      <main className="flex-grow flex flex-col md:flex-row">
        <ChatPanel 
          messages={messages}
          setMessages={setMessages}
          onGeneratePaintings={handleGeneratePaintings}
          isGenerating={generateMutation.isPending}
        />
        
        <GalleryPanel 
          paintings={paintings}
          prompt={prompt}
          isGenerating={generateMutation.isPending}
          generatingProgress={generatingProgress}
          generatingStatus={generatingStatus}
        />
      </main>
      
      <Footer />
    </div>
  );
}
