import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { History, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';

interface AuditEntry {
  id: string;
  admin_user_id: string;
  target_user_id: string | null;
  target_email: string | null;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

const ACTION_META: Record<string, { label: string; icon: typeof KeyRound }> = {
  password_reset: { label: 'Password Reset', icon: KeyRound },
};

export function AdminAuditLog() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit-log'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_log' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as unknown as AuditEntry[];
    },
  });

  return (
    <Card>
      <CardHeader className="p-4 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4 text-primary" />
          Admin Audit Log
        </CardTitle>
        <CardDescription className="text-xs">
          Recent admin actions, including password reset emails
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 md:px-4 md:pb-4">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : data && data.length > 0 ? (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="hidden md:table-cell">Details</TableHead>
                  <TableHead className="text-right">When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((e) => {
                  const meta = ACTION_META[e.action] ?? { label: e.action, icon: History };
                  const Icon = meta.icon;
                  return (
                    <TableRow key={e.id}>
                      <TableCell>
                        <Badge variant="secondary" className="gap-1.5">
                          <Icon className="h-3 w-3" />
                          {meta.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{e.target_email || e.target_user_id || '—'}</TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground truncate max-w-[280px]">
                        {e.details ? JSON.stringify(e.details) : '—'}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {format(new Date(e.created_at), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="p-6 text-sm text-muted-foreground text-center">No audit entries yet</p>
        )}
      </CardContent>
    </Card>
  );
}
