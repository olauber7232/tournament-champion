import { Home, Wallet, Trophy, DollarSign, User, HelpCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'winners', label: 'Winners', icon: Trophy },
  { id: 'earn', label: 'Earn$', icon: DollarSign },
  { id: 'profile', label: 'Me', icon: User },
];

export default function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-850 border-t border-border px-4 py-2 z-30">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex flex-col items-center py-2 px-3 rounded-lg transition-colors",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}