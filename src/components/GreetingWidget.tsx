import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset,
  Sparkles,
  Zap,
  Coffee,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';

interface GreetingWidgetProps {
  className?: string;
}

const getGreetingData = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return {
      greeting: 'Good morning',
      icon: Sunrise,
      gradient: 'from-warning/20 via-warning/10 to-transparent',
      iconColor: 'text-warning',
      message: 'Start your day with a clear view of your finances',
      emoji: '☀️'
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      greeting: 'Good afternoon',
      icon: Sun,
      gradient: 'from-task/20 via-task/10 to-transparent',
      iconColor: 'text-task',
      message: 'Stay on track with your financial goals',
      emoji: '🌤️'
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      greeting: 'Good evening',
      icon: Sunset,
      gradient: 'from-ticket/20 via-ticket/10 to-transparent',
      iconColor: 'text-ticket',
      message: 'Review your daily progress',
      emoji: '🌅'
    };
  } else {
    return {
      greeting: 'Good night',
      icon: Moon,
      gradient: 'from-primary/20 via-primary/10 to-transparent',
      iconColor: 'text-primary',
      message: 'Rest well, your finances are in order',
      emoji: '🌙'
    };
  }
};

const quickStats = [
  { label: 'Active Tasks', value: 3, icon: Zap, color: 'text-task bg-task/10' },
  { label: 'Open Tickets', value: 2, icon: Coffee, color: 'text-ticket bg-ticket/10' },
  { label: 'Goals Near', value: 1, icon: Star, color: 'text-warning bg-warning/10' }
];

export function GreetingWidget({ className }: GreetingWidgetProps) {
  const { user } = useAuth();
  const { profile } = useProfile();
  
  const greetingData = useMemo(() => getGreetingData(), []);
  const Icon = greetingData.icon;
  
  const displayName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 bg-card border border-border",
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Animated background gradient */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br",
        greetingData.gradient
      )} />
      
      {/* Floating decorative elements */}
      <motion.div 
        className="absolute top-4 right-4 opacity-20"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="w-24 h-24 text-primary" />
      </motion.div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className={cn("p-3 rounded-2xl bg-card shadow-md", greetingData.iconColor)}
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Icon className="w-6 h-6" />
            </motion.div>
            <div>
              <motion.p 
                className="text-sm text-muted-foreground flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {greetingData.greeting} <span className="text-lg">{greetingData.emoji}</span>
              </motion.p>
              <motion.h2 
                className="text-2xl font-display font-bold text-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Welcome back, {displayName}!
              </motion.h2>
            </div>
          </div>
        </div>
        
        <motion.p 
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {greetingData.message}
        </motion.p>
        
        {/* Quick Stats */}
        <motion.div 
          className="flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/80 backdrop-blur-sm border border-border shadow-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={cn("p-1.5 rounded-lg", stat.color)}>
                <stat.icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-sm font-bold text-foreground">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
