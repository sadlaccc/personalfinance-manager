import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Bell, 
  Ticket, 
  CheckSquare, 
  AlertCircle, 
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface Notification {
  id: string;
  type: 'ticket' | 'task' | 'alert' | 'info';
  title: string;
  message: string;
  time: Date;
  read: boolean;
}

interface NotificationWidgetProps {
  className?: string;
}

// Custom icons for different notification types
const NotificationIcon = ({ type }: { type: Notification['type'] }) => {
  const iconClass = "w-4 h-4 sm:w-5 sm:h-5";
  
  switch (type) {
    case 'ticket':
      return (
        <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-ticket/20">
          <Ticket className={cn(iconClass, "text-ticket")} />
        </div>
      );
    case 'task':
      return (
        <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-task/20">
          <CheckSquare className={cn(iconClass, "text-task")} />
        </div>
      );
    case 'alert':
      return (
        <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-warning/20">
          <AlertCircle className={cn(iconClass, "text-warning")} />
        </div>
      );
    case 'info':
      return (
        <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-info/20">
          <Sparkles className={cn(iconClass, "text-info")} />
        </div>
      );
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
};

// Demo notifications that simulate real-time updates
const generateDemoNotifications = (): Notification[] => [
  {
    id: '1',
    type: 'ticket',
    title: 'New Support Ticket',
    message: 'Customer inquiry about billing needs attention',
    time: new Date(Date.now() - 5 * 60000),
    read: false
  },
  {
    id: '2',
    type: 'task',
    title: 'Task Completed',
    message: 'Monthly budget review has been completed',
    time: new Date(Date.now() - 15 * 60000),
    read: false
  },
  {
    id: '3',
    type: 'alert',
    title: 'Budget Alert',
    message: 'You\'re approaching your dining budget limit',
    time: new Date(Date.now() - 30 * 60000),
    read: true
  },
  {
    id: '4',
    type: 'info',
    title: 'Weekly Summary',
    message: 'Your financial summary is ready to view',
    time: new Date(Date.now() - 60 * 60000),
    read: true
  }
];

const newNotificationTemplates: Partial<Notification>[] = [
  { type: 'ticket', title: 'Ticket Update', message: 'A ticket has been assigned to you' },
  { type: 'task', title: 'New Task', message: 'Review expense report for Q4' },
  { type: 'alert', title: 'Spending Alert', message: 'Unusual spending detected in Entertainment' },
  { type: 'info', title: 'Goal Progress', message: 'You\'re 75% towards your savings goal!' }
];

export function NotificationWidget({ className }: NotificationWidgetProps) {
  const [notifications, setNotifications] = useState<Notification[]>(generateDemoNotifications);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Simulate real-time notifications every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const template = newNotificationTemplates[Math.floor(Math.random() * newNotificationTemplates.length)];
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: template.type!,
        title: template.title!,
        message: template.message!,
        time: new Date(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };
  
  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <motion.div 
      className={cn(
        "bg-card border border-border rounded-2xl overflow-hidden",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-border bg-gradient-to-r from-ticket/5 to-task/5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={cn(
              "p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gradient-to-br from-ticket to-task transition-all",
              isAnimating && "animate-pulse shadow-lg shadow-ticket/30"
            )}>
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-sm sm:text-base">
                Notifications
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                Real-time updates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {unreadCount > 0 && (
              <Badge 
                variant="secondary" 
                className="bg-ticket text-ticket-foreground hover:bg-ticket/90 font-semibold text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5"
              >
                {unreadCount} new
              </Badge>
            )}
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-[10px] sm:text-xs text-muted-foreground hover:text-foreground h-7 px-2 hidden sm:inline-flex"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Notifications List */}
      <ScrollArea className="h-[200px] sm:h-[300px]">
        <div className="p-1.5 sm:p-2">
          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-8 sm:py-12 text-center"
              >
                <div className="p-3 sm:p-4 rounded-full bg-secondary mb-3">
                  <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">No notifications yet</p>
              </motion.div>
            ) : (
              notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  layout
                >
                  <div 
                    className={cn(
                      "group flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl cursor-pointer transition-all",
                      "hover:bg-secondary/50",
                      !notification.read && "bg-secondary/30 border-l-2 border-ticket"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex-shrink-0">
                      <NotificationIcon type={notification.type} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 sm:gap-2">
                        <p className={cn(
                          "text-xs sm:text-sm line-clamp-1",
                          !notification.read ? "font-semibold text-foreground" : "text-muted-foreground"
                        )}>
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 sm:h-6 sm:w-6 p-0 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notification.id);
                          }}
                        >
                          <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </Button>
                      </div>
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-xs text-muted-foreground">
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {formatTimeAgo(notification.time)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
      
      {/* Footer Stats */}
      <div className="p-2 sm:p-3 border-t border-border bg-secondary/30">
        <div className="flex items-center justify-around text-center">
          <div>
            <p className="text-sm sm:text-lg font-bold text-ticket">{notifications.filter(n => n.type === 'ticket').length}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Tickets</p>
          </div>
          <div className="w-px h-6 sm:h-8 bg-border" />
          <div>
            <p className="text-sm sm:text-lg font-bold text-task">{notifications.filter(n => n.type === 'task').length}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Tasks</p>
          </div>
          <div className="w-px h-6 sm:h-8 bg-border" />
          <div>
            <p className="text-sm sm:text-lg font-bold text-warning">{notifications.filter(n => n.type === 'alert').length}</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Alerts</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
