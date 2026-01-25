import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2 } from 'lucide-react';

type AppRole = 'admin' | 'moderator' | 'support' | 'analyst' | 'user';

const AVAILABLE_ROLES: { role: AppRole; label: string; description: string; color: string }[] = [
  { role: 'admin', label: 'Admin', description: 'Full access to all features', color: 'bg-destructive' },
  { role: 'moderator', label: 'Moderator', description: 'Can moderate content and users', color: 'bg-orange-500' },
  { role: 'support', label: 'Support', description: 'Can view and respond to user issues', color: 'bg-blue-500' },
  { role: 'analyst', label: 'Analyst', description: 'Can view analytics and reports', color: 'bg-purple-500' },
  { role: 'user', label: 'User', description: 'Standard user access', color: 'bg-muted' },
];

interface RoleManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string | null;
}

export function RoleManagementDialog({
  open,
  onOpenChange,
  userId,
  userName,
}: RoleManagementDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);

  // Fetch current roles for the user
  const { data: currentRoles, isLoading } = useQuery({
    queryKey: ['user-roles', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) throw error;
      const roles = data?.map((r) => r.role as AppRole) || [];
      setSelectedRoles(roles);
      return roles;
    },
    enabled: open && !!userId,
  });

  const updateRolesMutation = useMutation({
    mutationFn: async (roles: AppRole[]) => {
      // First, delete all existing roles for this user
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      // Then insert new roles (excluding 'user' as it's the default)
      const rolesToInsert = roles.filter(r => r !== 'user');
      if (rolesToInsert.length > 0) {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert(rolesToInsert.map(role => ({ user_id: userId, role })));

        if (insertError) throw insertError;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Roles updated',
        description: `Successfully updated roles for ${userName || 'user'}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['user-roles', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update roles.',
        variant: 'destructive',
      });
    },
  });

  const handleRoleToggle = (role: AppRole) => {
    setSelectedRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const handleSave = () => {
    updateRolesMutation.mutate(selectedRoles);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Manage Roles
          </DialogTitle>
          <DialogDescription>
            Assign roles to {userName || 'this user'}. Roles determine what features they can access.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-3">
              {AVAILABLE_ROLES.map(({ role, label, description, color }) => (
                <label
                  key={role}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedRoles.includes(role)}
                    onCheckedChange={() => handleRoleToggle(role)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{label}</span>
                      <Badge variant="secondary" className={`${color} text-white text-xs`}>
                        {role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {description}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateRolesMutation.isPending}
                className="flex-1"
              >
                {updateRolesMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Roles'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
