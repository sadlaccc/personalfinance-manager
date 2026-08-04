import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Wallet, ArrowRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { to: '/landing', label: 'Home' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

export function PublicNavbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (to: string) =>
    to === '/landing' ? pathname === '/' || pathname === '/landing' : pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-income flex items-center justify-center shadow-sm">
              <Wallet className="w-4 h-4 text-income-foreground" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">FedhaFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-full border border-border/60 bg-secondary/40 p-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors',
                  isActive(l.to)
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/auth" className="hidden sm:block">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth" className="hidden sm:block">
              <Button size="sm">
                Get Started
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <div className="flex flex-col h-full">
                  <div className="px-5 py-5 border-b border-border">
                    <span className="font-display font-bold text-lg">FedhaFlow</span>
                  </div>
                  <nav className="flex-1 p-3 space-y-1">
                    {links.map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                          isActive(l.to)
                            ? 'bg-gradient-income text-income-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary',
                        )}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="p-3 border-t border-border space-y-2">
                    <Link to="/auth" onClick={() => setOpen(false)} className="block">
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/auth" onClick={() => setOpen(false)} className="block">
                      <Button className="w-full">
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
