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
  const iconClass = "w-5 h-5";
  
  switch (type) {
    case 'ticket':
      return (
        <div className="p-2 rounded-xl bg-ticket/20">
          <Ticket className={cn(iconClass, "text-ticket")} />
        </div>
      );
    case 'task':
      return (
        <div className="p-2 rounded-xl bg-task/20">
          <CheckSquare className={cn(iconClass, "text-task")} />
        </div>
      );
    case 'alert':
      return (
        <div className="p-2 rounded-xl bg-warning/20">
          <AlertCircle className={cn(iconClass, "text-warning")} />
        </div>
      );
    case 'info':
      return (
        <div className="p-2 rounded-xl bg-info/20">
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
      <div className="p-4 border-b border-border bg-gradient-to-r from-ticket/5 to-task/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl bg-gradient-to-br from-ticket to-task transition-all",
              isAnimating && "animate-pulse shadow-lg shadow-ticket/30"
            )}>
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground">
                Notifications
              </h3>
              <p className="text-xs text-muted-foreground">
                Real-time updates
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge 
                variant="secondary" 
                className="bg-ticket text-ticket-foreground hover:bg-ticket/90 font-semibold"
              >
                {unreadCount} new
              </Badge>
            )}
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Notifications List */}
      <ScrollArea className="h-[300px]">
        <div className="p-2">
          <AnimatePresence mode="popLayout">
            {notifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="p-4 rounded-full bg-secondary mb-3">
                  <Bell className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No notifications yet</p>
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
                      "group flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all",
                      "hover:bg-secondary/50",
                      !notification.read && "bg-secondary/30 border-l-2 border-ticket"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <NotificationIcon type={notification.type} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn(
                          "text-sm",
                          !notification.read ? "font-semibold text-foreground" : "text-muted-foreground"
                        )}>
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissNotification(notification.id);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
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
      <div className="p-3 border-t border-border bg-secondary/30">
        <div className="flex items-center justify-around text-center">
          <div>
            <p className="text-lg font-bold text-ticket">{notifications.filter(n => n.type === 'ticket').length}</p>
            <p className="text-xs text-muted-foreground">Tickets</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-lg font-bold text-task">{notifications.filter(n => n.type === 'task').length}</p>
            <p className="text-xs text-muted-foreground">Tasks</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-lg font-bold text-warning">{notifications.filter(n => n.type === 'alert').length}</p>
            <p className="text-xs text-muted-foreground">Alerts</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
