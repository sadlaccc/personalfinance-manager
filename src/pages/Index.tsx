import Dashboard from './Dashboard';
import { PageTransition } from '@/components/PageTransition';

// Re-export Dashboard as the main Index page with page transition
const Index = () => (
  <PageTransition>
    <Dashboard />
  </PageTransition>
);

export default Index;
