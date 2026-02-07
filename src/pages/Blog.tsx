import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PageTransition } from '@/components/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { 
  Wallet, 
  ArrowRight,
  Calendar,
  Clock,
  User
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string;
  slug: string;
  published: boolean;
  featured: boolean;
  published_at: string | null;
  created_at: string;
  views: number;
}

const categoryColors: Record<string, string> = {
  'Savings': 'bg-success/10 text-success',
  'Budgeting': 'bg-primary/10 text-primary',
  'Goals': 'bg-accent/10 text-accent',
  'Getting Started': 'bg-ticket/10 text-ticket',
  'General': 'bg-muted text-muted-foreground',
  'Tips': 'bg-income/10 text-income',
  'News': 'bg-expense/10 text-expense',
};

// Estimate read time based on content length
const estimateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

export default function Blog() {
  // Fetch published blog posts from database
  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['public-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      return data as BlogPost[];
    },
  });

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
        <section className="py-8 sm:py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                FedhaFlow Blog
              </h1>
              <p className="text-muted-foreground">
                Tips, guides, and insights to help you master your personal finances.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Loading State */}
        {isLoading && (
          <section className="py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-full mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!isLoading && blogPosts.length === 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
            </div>
          </section>
        )}

        {/* Featured Posts */}
        {!isLoading && featuredPosts.length > 0 && (
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
                            {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {estimateReadTime(post.content)}
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
        {!isLoading && regularPosts.length > 0 && (
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
                          {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {estimateReadTime(post.content)}
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

        {/* CTA */}
        <section className="py-12 bg-gradient-to-r from-primary to-accent">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-xl sm:text-2xl font-bold text-primary-foreground mb-3">
                Ready to Take Control?
              </h2>
              <p className="text-primary-foreground/80 mb-4 max-w-lg mx-auto text-sm">
                Start your financial journey today with FedhaFlow.
              </p>
              <Link to="/auth">
                <Button size="default" variant="secondary">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} FedhaFlow. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
