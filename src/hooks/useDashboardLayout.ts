import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

const STORAGE_KEY = 'dashboard-widget-order';

const DEFAULT_WIDGETS = [
  'stats',
  'quick-actions',
  'financial-summary',
  'recent-income',
  'subscription',
  'income-chart',
  'daily-tip',
  'budget-overview',
];

export function useDashboardLayout() {
  const [widgetOrder, setWidgetOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all default widgets are present
        const merged = [...parsed.filter((w: string) => DEFAULT_WIDGETS.includes(w))];
        DEFAULT_WIDGETS.forEach(w => {
          if (!merged.includes(w)) merged.push(w);
        });
        return merged;
      }
    } catch {}
    return DEFAULT_WIDGETS;
  });

  const handleReorder = useCallback((activeId: string, overId: string) => {
    setWidgetOrder(prev => {
      const oldIndex = prev.indexOf(activeId);
      const newIndex = prev.indexOf(overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      const newOrder = arrayMove(prev, oldIndex, newIndex);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
      return newOrder;
    });
  }, []);

  const resetLayout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setWidgetOrder(DEFAULT_WIDGETS);
  }, []);

  return { widgetOrder, handleReorder, resetLayout };
}
