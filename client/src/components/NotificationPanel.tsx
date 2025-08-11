
import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  isRead: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { data: messagesData, refetch } = useQuery<{ messages: any[] }>({
    queryKey: ['/api/admin/messages'],
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  useEffect(() => {
    if (messagesData?.messages) {
      const newNotifications = messagesData.messages.map((message, index) => ({
        id: message.id || index,
        title: message.title,
        message: message.message,
        type: message.type || 'info' as const,
        createdAt: message.createdAt || new Date().toISOString(),
        isRead: false,
      }));
      setNotifications(newNotifications);
    }
  }, [messagesData]);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-3 max-h-full overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-accent/10 border-accent' : 'bg-muted/30'
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {notification.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
