import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';

interface GreetingWidgetProps {
  className?: string;
}

const getGreetingData = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Habari za asubuhi',
      icon: Sunrise,
      gradient: 'from-warning/20 via-warning/10 to-transparent',
      iconColor: 'text-warning',
      message: 'Start your day with a clear view of your finances',
      emoji: '☀️'
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: 'Habari za mchana',
      icon: Sun,
      gradient: 'from-task/20 via-task/10 to-transparent',
      iconColor: 'text-task',
      message: 'Stay on track with your financial goals',
      emoji: '🌤️'
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: 'Habari za jioni',
      icon: Sunset,
      gradient: 'from-ticket/20 via-ticket/10 to-transparent',
      iconColor: 'text-ticket',
      message: 'Review your daily progress',
      emoji: '🌅'
    };
  } else {
    return {
      greeting: 'Usiku mwema',
      icon: Moon,
      gradient: 'from-primary/20 via-primary/10 to-transparent',
      iconColor: 'text-primary',
      message: 'Rest well, your finances are in order',
      emoji: '🌙'
    };
  }
};

export function GreetingWidget({ className }: GreetingWidgetProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  // Only show greeting once per login session
  const [isVisible, setIsVisible] = useState(() => {
    const shown = sessionStorage.getItem('greeting_shown');
    return !shown;
  });
  
  const greetingData = useMemo(() => getGreetingData(), []);
  const Icon = greetingData.icon;
  
  const displayName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  // Auto-hide after 8 seconds and mark as shown
  useEffect(() => {
    if (!isVisible) return;
    sessionStorage.setItem('greeting_shown', 'true');
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className={cn(
            "relative overflow-hidden rounded-xl p-4 bg-card border border-border",
            className
          )}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0, padding: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Animated background gradient */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br",
            greetingData.gradient
          )} />
          
          {/* Decorative element - hidden on small screens */}
          <div className="absolute top-2 right-10 opacity-20 hidden sm:block pointer-events-none">
            <Sparkles className="w-12 h-12 text-primary" />
          </div>

          {/* Dismiss button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-60 hover:opacity-100"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-3 h-3" />
          </Button>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <motion.div 
                className={cn("p-2 rounded-xl bg-card shadow-sm", greetingData.iconColor)}
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {greetingData.greeting} <span className="text-base">{greetingData.emoji}</span>
                </p>
                <h2 className="text-base sm:text-lg font-display font-bold text-foreground">
                  Welcome back, {displayName}!
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              {greetingData.message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
