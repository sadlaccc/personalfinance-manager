import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PublicNavbar } from '@/components/PublicNavbar';
import { PublicFooter } from '@/components/PublicFooter';
import { PageTransition } from '@/components/PageTransition';
import { supabase } from '@/integrations/supabase/client';
import { 
  Wallet, 
  ArrowLeft, 
  ArrowRight,
  Calendar,
  Clock,
  Eye,
  Share2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const estimateReadTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      
      // Increment view count
      await supabase
        .from('blog_posts')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', data.id);

      return data as BlogPost;
    },
    enabled: !!slug,
  });

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || '',
          url,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied to clipboard!' });
    }
  };

  // Strip markdown bold/italic markers from text
  const cleanMarkdown = (text: string) => {
    return text
      .replace(/\*\*\*(.*?)\*\*\*/g, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/_(.*?)_/g, '$1');
  };

  // Render markdown-like content with simple formatting
  const renderContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    return paragraphs.map((paragraph, index) => {
      const cleaned = cleanMarkdown(paragraph);
      // Handle headers
      if (paragraph.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl sm:text-3xl font-bold text-foreground mt-8 mb-4">
            {cleanMarkdown(paragraph.slice(2))}
          </h1>
        );
      }
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl sm:text-2xl font-semibold text-foreground mt-6 mb-3">
            {cleanMarkdown(paragraph.slice(3))}
          </h2>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg sm:text-xl font-semibold text-foreground mt-5 mb-2">
            {cleanMarkdown(paragraph.slice(4))}
          </h3>
        );
      }
      // Handle bullet lists
      if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
        const items = paragraph.split('\n').filter(line => line.startsWith('- '));
        return (
          <ul key={index} className="list-disc list-inside space-y-2 my-4 text-muted-foreground">
            {items.map((item, i) => (
              <li key={i} className="leading-relaxed">{cleanMarkdown(item.slice(2))}</li>
            ))}
          </ul>
        );
      }
      // Handle numbered lists
      if (/^\d+\./.test(paragraph)) {
        const items = paragraph.split('\n').filter(line => /^\d+\./.test(line));
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 my-4 text-muted-foreground">
            {items.map((item, i) => (
              <li key={i} className="leading-relaxed">{cleanMarkdown(item.replace(/^\d+\.\s*/, ''))}</li>
            ))}
          </ol>
        );
      }
      // Regular paragraphs
      return (
        <p key={index} className="text-muted-foreground leading-relaxed my-4">
          {cleaned}
        </p>
      );
    });
  };

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-foreground mb-2">Post Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/blog')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <PublicNavbar />

        {/* Back Button */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/blog')} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-12 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="space-y-4 pt-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </article>
        )}

        {/* Article Content */}
        {post && (
          <article className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              {/* Article Header */}
              <header className="mb-8 pb-8 border-b border-border">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge className={categoryColors[post.category] || 'bg-muted'}>
                    {post.category}
                  </Badge>
                  {post.featured && (
                    <Badge variant="outline">Featured</Badge>
                  )}
                </div>
                
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 leading-tight">
                  {post.title}
                </h1>
                
                {post.excerpt && (
                  <p className="text-lg text-muted-foreground mb-6">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {estimateReadTime(post.content)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    {post.views.toLocaleString()} views
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </header>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                {renderContent(post.content)}
              </div>

              {/* CTA */}
              <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-primary to-accent rounded-2xl text-center">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-primary-foreground mb-2">
                  Ready to take control of your finances?
                </h3>
                <p className="text-primary-foreground/80 mb-4">
                  Start tracking your income and expenses with FedhaFlow today.
                </p>
                <Link to="/auth">
                  <Button variant="secondary" size="lg">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </article>
        )}

        <PublicFooter />
      </div>
    </PageTransition>
  );
}
