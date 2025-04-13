import { Button } from "@/components/ui/button";
import { Painting } from "@/types";
import { Download, Image, Loader2 } from "lucide-react";

interface GalleryPanelProps {
  paintings: Painting[];
  prompt: string;
  isGenerating: boolean;
  generatingProgress: number;
  generatingStatus: string;
}

export default function GalleryPanel({ 
  paintings, 
  prompt, 
  isGenerating, 
  generatingProgress,
  generatingStatus 
}: GalleryPanelProps) {
  
  const handleDownload = (imageUrl: string, title: string) => {
    // Create a link element to download the image
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Initial state (no paintings and not generating)
  if (paintings.length === 0 && !isGenerating) {
    return (
      <div className="w-full md:w-1/2 lg:w-3/5 bg-gray-50 overflow-y-auto p-6 h-[calc(100vh-120px)]">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-6">
            <Image className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Your Personalized Gallery</h3>
          <p className="mt-2 text-gray-500 max-w-md">
            Have a conversation with AI about your emotions, experiences, or ideas. 
            When you're ready, generate unique paintings inspired by your discussion.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isGenerating) {
    return (
      <div className="w-full md:w-1/2 lg:w-3/5 bg-gray-50 overflow-y-auto p-6 h-[calc(100vh-120px)]">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-6" />
          <h3 className="text-xl font-semibold text-gray-900">Creating Your Paintings</h3>
          <p className="mt-2 text-gray-500 max-w-md">
            Please wait while we transform your conversation into unique artwork...
          </p>
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm w-full max-w-md">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${generatingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{generatingStatus}</p>
          </div>
        </div>
      </div>
    );
  }

  // Gallery state
  return (
    <div className="w-full md:w-1/2 lg:w-3/5 bg-gray-50 overflow-y-auto p-6 h-[calc(100vh-120px)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Personalized Paintings</h2>
        <p className="text-gray-500 mt-1">Inspired by your conversation</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {paintings.map((painting, index) => (
          <div 
            key={painting.id} 
            className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md hover:-translate-y-1"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="relative pb-[66.67%] bg-gray-100">
              <img 
                src={painting.imageUrl} 
                alt={painting.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg text-gray-900">{painting.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{painting.description}</p>
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
                  onClick={() => handleDownload(painting.imageUrl, painting.title)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {prompt && (
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-medium text-lg text-gray-900 mb-2">Painting Prompt</h3>
          <p className="text-gray-600 text-sm italic">{prompt}</p>
        </div>
      )}
    </div>
  );
}
