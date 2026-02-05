 import { useState } from 'react';
 import { useMutation, useQuery } from '@tanstack/react-query';
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
 import { Checkbox } from '@/components/ui/checkbox';
 import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
 import { toast } from 'sonner';
 import { Mail, Send, Users } from 'lucide-react';
 import { format } from 'date-fns';
 
 interface TeamMember {
   id: string;
   member_email: string;
   role: string;
   status: string;
 }
 
 interface SendTeamDigestDialogProps {
   teamStats: {
     totalIncome: number;
     totalExpenses: number;
     netIncome: number;
     goalsProgress: number;
   } | null;
   children: React.ReactNode;
 }
 
 export function SendTeamDigestDialog({ teamStats, children }: SendTeamDigestDialogProps) {
   const { user } = useAuth();
   const [open, setOpen] = useState(false);
   const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
   const [customMessage, setCustomMessage] = useState('');
   const [includeOwner, setIncludeOwner] = useState(true);
 
   const { data: teamMembers = [], isLoading } = useQuery({
     queryKey: ['team-members-digest', user?.id],
     queryFn: async () => {
       if (!user) return [];
       const { data, error } = await supabase
         .from('team_members')
         .select('id, member_email, role, status')
         .eq('team_owner_id', user.id)
         .eq('status', 'active');
 
       if (error) throw error;
       return data as TeamMember[];
     },
     enabled: !!user && open,
   });
 
   const sendDigest = useMutation({
     mutationFn: async () => {
       if (!user) throw new Error('Not authenticated');
 
       const recipients: string[] = [];
       if (includeOwner && user.email) recipients.push(user.email);
       selectedMembers.forEach((memberId) => {
         const member = teamMembers.find((m) => m.id === memberId);
         if (member) recipients.push(member.member_email);
       });
 
       if (recipients.length === 0) {
         throw new Error('Please select at least one recipient');
       }
 
       const digestContent = `
         <h2>Team Financial Digest - ${format(new Date(), 'MMMM yyyy')}</h2>
         <p>Here's your team's financial summary:</p>
         <ul>
           <li><strong>Total Income:</strong> KSh ${teamStats?.totalIncome?.toLocaleString() || 0}</li>
           <li><strong>Total Expenses:</strong> KSh ${teamStats?.totalExpenses?.toLocaleString() || 0}</li>
           <li><strong>Net Income:</strong> KSh ${teamStats?.netIncome?.toLocaleString() || 0}</li>
           <li><strong>Goals Progress:</strong> ${teamStats?.goalsProgress || 0}%</li>
         </ul>
         ${customMessage ? `<p><strong>Message from owner:</strong> ${customMessage}</p>` : ''}
         <p>Keep up the great work!</p>
       `;
 
       const { error } = await supabase.functions.invoke('send-admin-email', {
         body: {
           to: recipients,
           subject: `FedhaFlow Team Digest - ${format(new Date(), 'MMMM yyyy')}`,
           html: digestContent,
         },
       });
 
       if (error) throw error;
     },
     onSuccess: () => {
       toast.success('Team digest sent successfully!');
       setOpen(false);
       setSelectedMembers([]);
       setCustomMessage('');
     },
     onError: (error: Error) => {
       toast.error(error.message || 'Failed to send digest');
     },
   });
 
   const toggleMember = (memberId: string) => {
     setSelectedMembers((prev) =>
       prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
     );
   };
 
   const selectAll = () => {
     if (selectedMembers.length === teamMembers.length) {
       setSelectedMembers([]);
     } else {
       setSelectedMembers(teamMembers.map((m) => m.id));
     }
   };
 
   return (
     <Dialog open={open} onOpenChange={setOpen}>
       <DialogTrigger asChild>{children}</DialogTrigger>
       <DialogContent className="max-w-md">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2">
             <Mail className="w-5 h-5" />
             Send Team Digest
           </DialogTitle>
           <DialogDescription>
             Share your team's financial summary via email
           </DialogDescription>
         </DialogHeader>
 
         <div className="space-y-4">
           {/* Preview Stats */}
           <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-secondary/30">
             <div className="text-center">
               <p className="text-lg font-bold text-income">KSh {teamStats?.totalIncome?.toLocaleString() || 0}</p>
               <p className="text-xs text-muted-foreground">Income</p>
             </div>
             <div className="text-center">
               <p className="text-lg font-bold text-expense">KSh {teamStats?.totalExpenses?.toLocaleString() || 0}</p>
               <p className="text-xs text-muted-foreground">Expenses</p>
             </div>
           </div>
 
           {/* Recipients */}
           <div className="space-y-2">
             <div className="flex items-center justify-between">
               <Label>Recipients</Label>
               {teamMembers.length > 0 && (
                 <Button variant="ghost" size="sm" onClick={selectAll}>
                   {selectedMembers.length === teamMembers.length ? 'Deselect All' : 'Select All'}
                 </Button>
               )}
             </div>
 
             <div className="space-y-2 max-h-40 overflow-y-auto">
               {/* Owner */}
               <div className="flex items-center space-x-3 p-2 rounded-lg bg-secondary/50">
                 <Checkbox
                   id="owner"
                   checked={includeOwner}
                   onCheckedChange={(checked) => setIncludeOwner(checked as boolean)}
                 />
                 <Label htmlFor="owner" className="flex-1 cursor-pointer text-sm">
                   {user?.email} <span className="text-muted-foreground">(You)</span>
                 </Label>
               </div>
 
               {/* Team Members */}
               {isLoading ? (
                 <p className="text-sm text-muted-foreground text-center py-2">Loading...</p>
               ) : teamMembers.length === 0 ? (
                 <p className="text-sm text-muted-foreground text-center py-2">
                   No active team members
                 </p>
               ) : (
                 teamMembers.map((member) => (
                   <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg bg-secondary/50">
                     <Checkbox
                       id={member.id}
                       checked={selectedMembers.includes(member.id)}
                       onCheckedChange={() => toggleMember(member.id)}
                     />
                     <Label htmlFor={member.id} className="flex-1 cursor-pointer text-sm truncate">
                       {member.member_email}
                     </Label>
                   </div>
                 ))
               )}
             </div>
           </div>
 
           {/* Custom Message */}
           <div className="space-y-2">
             <Label htmlFor="message">Custom Message (Optional)</Label>
             <Textarea
               id="message"
               placeholder="Add a personal note to your team..."
               value={customMessage}
               onChange={(e) => setCustomMessage(e.target.value)}
               rows={3}
             />
           </div>
         </div>
 
         <DialogFooter>
           <Button variant="outline" onClick={() => setOpen(false)}>
             Cancel
           </Button>
           <Button
             onClick={() => sendDigest.mutate()}
             disabled={sendDigest.isPending || (!includeOwner && selectedMembers.length === 0)}
           >
             <Send className="w-4 h-4 mr-2" />
             {sendDigest.isPending ? 'Sending...' : 'Send Digest'}
           </Button>
         </DialogFooter>
       </DialogContent>
     </Dialog>
   );
 }