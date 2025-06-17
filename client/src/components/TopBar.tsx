import { Trophy, Wallet, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface TopBarProps {
  onWalletClick: () => void;
  onNotificationClick: () => void;
}

export default function TopBar({ onWalletClick, onNotificationClick }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-gray-850 border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center">
        <div className="w-8 h-8 gradient-gaming rounded-lg flex items-center justify-center mr-3">
          <Trophy className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg">Kirda</span>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onWalletClick} className="relative">
          <Wallet className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 bg-accent text-xs rounded-full w-5 h-5 flex items-center justify-center text-black font-semibold">
            ₹
          </span>
        </Button>

        <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={onNotificationClick}
          >
            <Bell className="w-5 h-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center"
            >
              1
            </Badge>
          </Button>
      </div>
    </header>
  );
}