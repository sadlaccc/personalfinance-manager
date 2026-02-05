 import { useState } from 'react';
 import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
 import { supabase } from '@/integrations/supabase/client';
 import { useAuth } from '@/contexts/AuthContext';
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from '@/components/ui/dialog';
 import { Button } from '@/components/ui/button';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { Badge } from '@/components/ui/badge';
 import { toast } from 'sonner';
 import { Shield, User, Eye, Edit, Crown } from 'lucide-react';
 
 interface TeamMember {
   id: string;
   team_owner_id: string;
   member_email: string;
   member_user_id: string | null;
   role: 'owner' | 'admin' | 'member' | 'viewer';
   status: 'pending' | 'active' | 'revoked';
 }
 
 interface ManagePermissionsDialogProps {
   children: React.ReactNode;
 }
 
 const ROLE_CONFIG = {
   admin: { icon: Shield, label: 'Admin', color: 'text-amber-500', description: 'Full access to all features' },
   member: { icon: Edit, label: 'Member', color: 'text-blue-500', description: 'Can create and edit records' },
   viewer: { icon: Eye, label: 'Viewer', color: 'text-muted-foreground', description: 'Read-only access' },
 };
 
 export function ManagePermissionsDialog({ children }: ManagePermissionsDialogProps) {
   const { user } = useAuth();
   const queryClient = useQueryClient();
   const [open, setOpen] = useState(false);
 
   const { data: teamMembers = [], isLoading } = useQuery({
     queryKey: ['team-members', user?.id],
     queryFn: async () => {
       if (!user) return [];
       const { data, error } = await supabase
         .from('team_members')
         .select('*')
         .eq('team_owner_id', user.id)
         .neq('status', 'revoked')
         .order('role', { ascending: true });
 
       if (error) throw error;
       return data as TeamMember[];
     },
     enabled: !!user && open,
   });
 
   const updateRole = useMutation({
     mutationFn: async ({ memberId, newRole }: { memberId: string; newRole: 'admin' | 'member' | 'viewer' }) => {
       const { error } = await supabase
         .from('team_members')
         .update({ role: newRole })
         .eq('id', memberId);
 
       if (error) throw error;
     },
     onSuccess: () => {
       toast.success('Permission updated!');
       queryClient.invalidateQueries({ queryKey: ['team-members'] });
     },
     onError: () => {
       toast.error('Failed to update permission');
     },
   });
 
   return (
     <Dialog open={open} onOpenChange={setOpen}>
       <DialogTrigger asChild>{children}</DialogTrigger>
       <DialogContent className="max-w-md sm:max-w-lg">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <Shield className="w-5 h-5" />
             Manage Permissions
           </DialogTitle>
           <DialogDescription>
             Control what each team member can access and modify
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-4">
           {/* Role Legend */}
           <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-secondary/30">
             {Object.entries(ROLE_CONFIG).map(([role, config]) => {
               const Icon = config.icon;
               return (
                 <div key={role} className="text-center">
                   <Icon className={`w-4 h-4 mx-auto ${config.color}`} />
                   <p className="text-xs font-medium mt-1">{config.label}</p>
                 </div>
               );
             })}
           </div>
 
           {/* Owner (current user) */}
           <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-semibold">
                 {user?.email?.charAt(0).toUpperCase()}
               </div>
               <div>
                 <p className="text-sm font-medium">{user?.email}</p>
                 <p className="text-xs text-muted-foreground">You</p>
               </div>
             </div>
             <Badge variant="outline" className="border-amber-500 text-amber-500">
               <Crown className="w-3 h-3 mr-1" />
               Owner
             </Badge>
           </div>
 
           {/* Team Members */}
           {isLoading ? (
             <p className="text-sm text-muted-foreground text-center py-4">Loading team members...</p>
           ) : teamMembers.length === 0 ? (
             <p className="text-sm text-muted-foreground text-center py-4">
               No team members yet. Invite members to manage their permissions.
             </p>
           ) : (
             <div className="space-y-2 max-h-64 overflow-y-auto">
               {teamMembers.map((member) => {
                 const roleConfig = ROLE_CONFIG[member.role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.viewer;
                 const Icon = roleConfig.icon;
                 return (
                   <div
                     key={member.id}
                     className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                         {member.member_email.charAt(0).toUpperCase()}
                       </div>
                       <div>
                         <p className="text-sm font-medium truncate max-w-[150px]">{member.member_email}</p>
                         <p className="text-xs text-muted-foreground">
                           {member.status === 'pending' ? 'Pending invitation' : 'Active'}
                         </p>
                       </div>
                     </div>
                     <Select
                       value={member.role}
                       onValueChange={(v) =>
                         updateRole.mutate({ memberId: member.id, newRole: v as 'admin' | 'member' | 'viewer' })
                       }
                       disabled={updateRole.isPending}
                     >
                       <SelectTrigger className="w-28">
                         <SelectValue />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="admin">
                           <span className="flex items-center gap-2">
                             <Shield className="w-3 h-3" />
                             Admin
                           </span>
                         </SelectItem>
                         <SelectItem value="member">
                           <span className="flex items-center gap-2">
                             <Edit className="w-3 h-3" />
                             Member
                           </span>
                         </SelectItem>
                         <SelectItem value="viewer">
                           <span className="flex items-center gap-2">
                             <Eye className="w-3 h-3" />
                             Viewer
                           </span>
                         </SelectItem>
                       </SelectContent>
                     </Select>
                   </div>
                 );
               })}
             </div>
           )}
         </div>
 
         <DialogFooter>
           <Button variant="outline" onClick={() => setOpen(false)}>
             Done
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 }