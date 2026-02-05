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
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from '@/components/ui/select';
 import { Badge } from '@/components/ui/badge';
 import { toast } from 'sonner';
 import { UserPlus, Trash2, Mail, Shield, Eye, Edit } from 'lucide-react';
 
 interface TeamMember {
   id: string;
   team_owner_id: string;
   member_email: string;
   member_user_id: string | null;
   role: 'owner' | 'admin' | 'member' | 'viewer';
   status: 'pending' | 'active' | 'revoked';
   invited_at: string;
   accepted_at: string | null;
 }
 
 interface InviteTeamMemberDialogProps {
   maxTeamSize: number;
   currentTeamSize: number;
   children: React.ReactNode;
 }
 
 const ROLE_ICONS = {
   owner: Shield,
   admin: Shield,
   member: Edit,
   viewer: Eye,
 };
 
 const ROLE_LABELS: Record<string, string> = {
   admin: 'Admin - Full access',
   member: 'Member - Can edit',
   viewer: 'Viewer - Read only',
 };
 
 export function InviteTeamMemberDialog({ maxTeamSize, currentTeamSize, children }: InviteTeamMemberDialogProps) {
   const { user } = useAuth();
   const queryClient = useQueryClient();
   const [open, setOpen] = useState(false);
   const [email, setEmail] = useState('');
   const [role, setRole] = useState<'admin' | 'member' | 'viewer'>('member');
 
   const { data: teamMembers = [], isLoading } = useQuery({
     queryKey: ['team-members', user?.id],
     queryFn: async () => {
       if (!user) return [];
       const { data, error } = await supabase
         .from('team_members')
         .select('*')
         .eq('team_owner_id', user.id)
         .order('invited_at', { ascending: false });
 
       if (error) throw error;
       return data as TeamMember[];
     },
     enabled: !!user && open,
   });
 
   const inviteMember = useMutation({
     mutationFn: async () => {
       if (!user) throw new Error('Not authenticated');
       if (!email.trim()) throw new Error('Email is required');
 
       // Check if already invited
       const existing = teamMembers.find(
         (m) => m.member_email.toLowerCase() === email.toLowerCase() && m.status !== 'revoked'
       );
       if (existing) throw new Error('This email has already been invited');
 
       // Check team capacity
       const activeMembers = teamMembers.filter((m) => m.status !== 'revoked').length + 1; // +1 for owner
       if (activeMembers >= maxTeamSize) {
         throw new Error(`Team limit reached (${maxTeamSize} members)`);
       }
 
       const { error } = await supabase.from('team_members').insert({
         team_owner_id: user.id,
         member_email: email.toLowerCase().trim(),
         role,
         status: 'pending',
       });
 
       if (error) throw error;
     },
     onSuccess: () => {
       toast.success('Invitation sent successfully!');
       setEmail('');
       setRole('member');
       queryClient.invalidateQueries({ queryKey: ['team-members'] });
       queryClient.invalidateQueries({ queryKey: ['business-team-stats'] });
     },
     onError: (error: Error) => {
       toast.error(error.message || 'Failed to send invitation');
     },
   });
 
   const revokeMember = useMutation({
     mutationFn: async (memberId: string) => {
       const { error } = await supabase
         .from('team_members')
         .update({ status: 'revoked' })
         .eq('id', memberId);
 
       if (error) throw error;
     },
     onSuccess: () => {
       toast.success('Member removed from team');
       queryClient.invalidateQueries({ queryKey: ['team-members'] });
       queryClient.invalidateQueries({ queryKey: ['business-team-stats'] });
     },
     onError: () => {
       toast.error('Failed to remove member');
     },
   });
 
   const activeMembers = teamMembers.filter((m) => m.status !== 'revoked');
   const pendingMembers = teamMembers.filter((m) => m.status === 'pending');
 
   return (
     <Dialog open={open} onOpenChange={setOpen}>
       <DialogTrigger asChild>{children}</DialogTrigger>
       <DialogContent className="max-w-md sm:max-w-lg">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <UserPlus className="w-5 h-5" />
             Invite Team Member
           </DialogTitle>
           <DialogDescription>
             Add members to your team ({activeMembers.length + 1}/{maxTeamSize === 999 ? '∞' : maxTeamSize} seats used)
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-4">
           {/* Invite Form */}
           <div className="space-y-3">
             <div className="space-y-2">
               <Label htmlFor="email">Email Address</Label>
               <Input
                 id="email"
                 type="email"
                 placeholder="colleague@company.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
               />
             </div>
             <div className="space-y-2">
               <Label htmlFor="role">Role</Label>
               <Select value={role} onValueChange={(v) => setRole(v as 'admin' | 'member' | 'viewer')}>
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="admin">Admin - Full access</SelectItem>
                   <SelectItem value="member">Member - Can edit</SelectItem>
                   <SelectItem value="viewer">Viewer - Read only</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             <Button
               className="w-full"
               onClick={() => inviteMember.mutate()}
               disabled={inviteMember.isPending || !email.trim()}
             >
               <Mail className="w-4 h-4 mr-2" />
               {inviteMember.isPending ? 'Sending...' : 'Send Invitation'}
             </Button>
           </div>
 
           {/* Pending Invitations */}
           {pendingMembers.length > 0 && (
             <div className="space-y-2">
               <h4 className="text-sm font-medium text-muted-foreground">Pending Invitations</h4>
               <div className="space-y-2 max-h-32 overflow-y-auto">
                 {pendingMembers.map((member) => {
                   const RoleIcon = ROLE_ICONS[member.role];
                   return (
                     <div
                       key={member.id}
                       className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                     >
                       <div className="flex items-center gap-2">
                         <Mail className="w-4 h-4 text-muted-foreground" />
                         <span className="text-sm truncate max-w-[150px]">{member.member_email}</span>
                         <Badge variant="outline" className="text-xs">
                           <RoleIcon className="w-3 h-3 mr-1" />
                           {member.role}
                         </Badge>
                       </div>
                       <Button
                         variant="ghost"
                         size="icon"
                         className="h-7 w-7 text-destructive"
                         onClick={() => revokeMember.mutate(member.id)}
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                       </Button>
                     </div>
                   );
                 })}
               </div>
             </div>
           )}
 
           {/* Active Members */}
           {activeMembers.filter((m) => m.status === 'active').length > 0 && (
             <div className="space-y-2">
               <h4 className="text-sm font-medium text-muted-foreground">Active Members</h4>
               <div className="space-y-2 max-h-32 overflow-y-auto">
                 {activeMembers
                   .filter((m) => m.status === 'active')
                   .map((member) => {
                     const RoleIcon = ROLE_ICONS[member.role];
                     return (
                       <div
                         key={member.id}
                         className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                       >
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                             {member.member_email.charAt(0).toUpperCase()}
                           </div>
                           <span className="text-sm truncate max-w-[150px]">{member.member_email}</span>
                           <Badge variant="secondary" className="text-xs">
                             <RoleIcon className="w-3 h-3 mr-1" />
                             {member.role}
                           </Badge>
                         </div>
                         <Button
                           variant="ghost"
                           size="icon"
                           className="h-7 w-7 text-destructive"
                           onClick={() => revokeMember.mutate(member.id)}
                         >
                           <Trash2 className="w-3.5 h-3.5" />
                         </Button>
                       </div>
                     );
                   })}
               </div>
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