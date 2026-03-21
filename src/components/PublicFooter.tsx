import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t border-border py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Wallet className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-sm">FedhaFlow</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/landing" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FedhaFlow
          </p>
        </div>
      </div>
    </footer>
  );
}
