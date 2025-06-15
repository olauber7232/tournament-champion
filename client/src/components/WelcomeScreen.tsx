import { useEffect } from "react";
import { Trophy } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-gray-850 to-gray-900 flex items-center justify-center z-50">
      <div className="text-center animate-fade-in">
        {/* Animated Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto gradient-gaming rounded-full flex items-center justify-center animate-pulse-glow">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gradient mb-2">
          Welcome to Kirda
        </h1>
        <p className="text-muted-foreground mb-8">Tournament Gaming Platform</p>
        
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
