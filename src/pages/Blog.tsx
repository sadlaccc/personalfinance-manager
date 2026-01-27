import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageTransition } from '@/components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  ArrowRight,
  Calendar,
  Clock,
  User
} from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: '10 Simple Ways to Save Money This Month',
    excerpt: 'Discover practical tips to cut expenses and boost your savings without sacrificing your lifestyle.',
    category: 'Savings',
    author: 'IncomeFlow Team',
    date: '2026-01-20',
    readTime: '5 min read',
    featured: true,
  },
  {
    id: 2,
    title: 'Understanding Your Spending Patterns',
    excerpt: 'Learn how to analyze your expenses and identify areas where you can optimize your budget.',
    category: 'Budgeting',
    author: 'IncomeFlow Team',
    date: '2026-01-15',
    readTime: '7 min read',
    featured: false,
  },
  {
    id: 3,
    title: 'Setting Financial Goals That Actually Work',
    excerpt: 'A comprehensive guide to creating SMART financial goals and staying motivated to achieve them.',
    category: 'Goals',
    author: 'IncomeFlow Team',
    date: '2026-01-10',
    readTime: '6 min read',
    featured: false,
  },
  {
    id: 4,
    title: 'The Beginner\'s Guide to Personal Finance',
    excerpt: 'Everything you need to know to start managing your money like a pro, even with no prior experience.',
    category: 'Getting Started',
    author: 'IncomeFlow Team',
    date: '2026-01-05',
    readTime: '10 min read',
    featured: true,
  },
  {
    id: 5,
    title: 'How to Build an Emergency Fund',
    excerpt: 'Why you need an emergency fund and step-by-step instructions to build one that protects your future.',
    category: 'Savings',
    author: 'IncomeFlow Team',
    date: '2025-12-28',
    readTime: '8 min read',
    featured: false,
  },
  {
    id: 6,
    title: 'Tracking Expenses: Manual vs Automatic',
    excerpt: 'Compare different expense tracking methods and find the one that works best for your lifestyle.',
    category: 'Budgeting',
    author: 'IncomeFlow Team',
    date: '2025-12-20',
    readTime: '4 min read',
    featured: false,
  },
];

const categoryColors: Record<string, string> = {
  'Savings': 'bg-success/10 text-success',
  'Budgeting': 'bg-primary/10 text-primary',
  'Goals': 'bg-accent/10 text-accent',
  'Getting Started': 'bg-ticket/10 text-ticket',
};

export default function Blog() {
  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Link to="/landing" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                  <Wallet className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-lg tracking-tight">IncomeFlow</span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link to="/blog" className="text-sm text-foreground font-medium">
                  Blog
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </nav>

              <div className="flex items-center gap-2 sm:gap-3">
                <ThemeToggle />
                <Link to="/auth">
                  <Button size="sm">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="py-12 sm:py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                IncomeFlow Blog
              </h1>
              <p className="text-lg text-muted-foreground">
                Tips, guides, and insights to help you master your personal finances.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-display text-2xl font-bold mb-6">Featured</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={categoryColors[post.category] || 'bg-muted'}>
                            {post.category}
                          </Badge>
                          <Badge variant="outline">Featured</Badge>
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{post.excerpt}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.readTime}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold mb-6">All Posts</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer group">
                    <CardHeader>
                      <Badge className={`${categoryColors[post.category] || 'bg-muted'} w-fit`}>
                        {post.category}
                      </Badge>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors mt-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-accent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground mb-4">
                Ready to Take Control?
              </h2>
              <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
                Start your financial journey today with IncomeFlow.
              </p>
              <Link to="/auth">
                <Button size="lg" variant="secondary">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} IncomeFlow. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
