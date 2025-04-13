import { Button } from "@/components/ui/button";
import { PaintbrushVertical, Plus } from "lucide-react";

interface HeaderProps {
  onNewSession: () => void;
}

export default function Header({ onNewSession }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <PaintbrushVertical className="h-5 w-5 text-white" />
          </div>
          <h1 className="ml-3 text-2xl font-bold text-gray-900">Personal Painter</h1>
        </div>
        
        <Button onClick={onNewSession} className="inline-flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Painting
        </Button>
      </div>
    </header>
  );
}
