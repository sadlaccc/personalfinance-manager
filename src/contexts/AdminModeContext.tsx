import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useUserRole } from '@/hooks/useUserRole';

type AdminMode = 'admin' | 'personal';

interface AdminModeContextValue {
  mode: AdminMode;
  setMode: (mode: AdminMode) => void;
  toggleMode: () => void;
  isAdmin: boolean;
}

const AdminModeContext = createContext<AdminModeContextValue | undefined>(undefined);

const STORAGE_KEY = 'fedhaflow:admin-mode';

export function AdminModeProvider({ children }: { children: ReactNode }) {
  const { isAdmin } = useUserRole();
  const [mode, setModeState] = useState<AdminMode>('personal');

  // Load persisted mode once role is known
  useEffect(() => {
    if (!isAdmin) {
      setModeState('personal');
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as AdminMode | null;
      if (stored === 'admin' || stored === 'personal') {
        setModeState(stored);
      } else {
        setModeState('admin');
      }
    } catch {
      setModeState('admin');
    }
  }, [isAdmin]);

  const setMode = useCallback((next: AdminMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleMode = useCallback(() => {
    setMode(mode === 'admin' ? 'personal' : 'admin');
  }, [mode, setMode]);

  return (
    <AdminModeContext.Provider value={{ mode, setMode, toggleMode, isAdmin }}>
      {children}
    </AdminModeContext.Provider>
  );
}

export function useAdminMode() {
  const ctx = useContext(AdminModeContext);
  if (!ctx) {
    throw new Error('useAdminMode must be used within AdminModeProvider');
  }
  return ctx;
}
