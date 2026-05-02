import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';

// Auth: pretend a user is signed in.
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { email: 'admin@example.com' }, signOut: vi.fn() }),
}));

// Force admin role so the Admin section renders.
vi.mock('@/hooks/useUserRole', () => ({
  useUserRole: () => ({ isAdmin: true, isLoading: false }),
}));

vi.mock('@/hooks/useSubscription', () => ({
  useSubscription: () => ({ subscription: { plan_type: 'pro' } }),
  PLAN_LABELS: {},
}));

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

vi.mock('@/contexts/AdminModeContext', () => ({
  useAdminMode: () => ({ mode: 'admin', setMode: vi.fn(), toggleMode: vi.fn(), isAdmin: true }),
}));

function renderSidebar() {
  const qc = new QueryClient();
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('AppSidebar (admin view)', () => {
  it('renders the Admin Dashboard entry', () => {
    renderSidebar();
    expect(screen.getAllByText(/Admin Dashboard/i).length).toBeGreaterThan(0);
  });

  it('does NOT render any "financials" entry points', () => {
    const { container } = renderSidebar();
    // Case-insensitive scan of all rendered text.
    const text = (container.textContent || '').toLowerCase();
    expect(text).not.toContain('financial');
    expect(text).not.toContain('user finances');
  });

  it('does NOT link to any /financials or /user-financials route', () => {
    const { container } = renderSidebar();
    const links = Array.from(container.querySelectorAll('a')).map(
      (a) => a.getAttribute('href') || '',
    );
    for (const href of links) {
      expect(href.toLowerCase()).not.toMatch(/financial/);
    }
  });
});
