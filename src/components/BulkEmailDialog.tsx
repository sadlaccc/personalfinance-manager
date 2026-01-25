import { useState } from 'react';
import { Mail, Send, Loader2, Users } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AdminUser } from '@/hooks/useAdminUsers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const emailSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  message: z.string().min(1, 'Message is required').max(5000, 'Message too long'),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface BulkEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: AdminUser[];
}

export function BulkEmailDialog({ open, onOpenChange, users }: BulkEmailDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [sendProgress, setSendProgress] = useState({ sent: 0, total: 0 });

  const usersWithEmail = users.filter((u) => u.email);

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: '',
      message: '',
    },
  });

  const toggleUser = (userId: string) => {
    const newSelected = new Set(selectedUserIds);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUserIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedUserIds.size === usersWithEmail.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(usersWithEmail.map((u) => u.id)));
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const onSubmit = async (data: EmailFormData) => {
    if (selectedUserIds.size === 0) {
      toast({
        title: 'No users selected',
        description: 'Please select at least one user to send the email to.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSendProgress({ sent: 0, total: selectedUserIds.size });

    const selectedUsers = usersWithEmail.filter((u) => selectedUserIds.has(u.id));
    let successCount = 0;
    let failCount = 0;

    for (const user of selectedUsers) {
      try {
        const { error } = await supabase.functions.invoke('send-admin-email', {
          body: {
            to: user.email,
            subject: data.subject,
            message: data.message,
            userName: user.full_name,
          },
        });

        if (error) throw error;
        successCount++;
      } catch (error) {
        console.error(`Failed to send to ${user.email}:`, error);
        failCount++;
      }
      setSendProgress((prev) => ({ ...prev, sent: prev.sent + 1 }));
    }

    setIsLoading(false);

    if (failCount === 0) {
      toast({
        title: 'All emails sent!',
        description: `Successfully sent ${successCount} email(s).`,
      });
      form.reset();
      setSelectedUserIds(new Set());
      onOpenChange(false);
    } else {
      toast({
        title: 'Some emails failed',
        description: `Sent ${successCount}, failed ${failCount}.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Bulk Email
          </DialogTitle>
          <DialogDescription>
            Send an email to multiple users at once
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
          {/* User Selection */}
          <div className="md:w-1/2 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Select Recipients ({selectedUserIds.size}/{usersWithEmail.length})
              </span>
              <Button variant="ghost" size="sm" onClick={toggleAll}>
                {selectedUserIds.size === usersWithEmail.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            <ScrollArea className="h-48 md:h-64 border rounded-lg p-2">
              {usersWithEmail.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No users with email addresses
                </p>
              ) : (
                <div className="space-y-1">
                  {usersWithEmail.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedUserIds.has(user.id)
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => toggleUser(user.id)}
                    >
                      <Checkbox
                        checked={selectedUserIds.has(user.id)}
                        onCheckedChange={() => toggleUser(user.id)}
                      />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getInitials(user.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {user.full_name || 'No name'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            {selectedUserIds.size > 0 && (
              <Badge variant="secondary" className="mt-2 self-start">
                {selectedUserIds.size} user(s) selected
              </Badge>
            )}
          </div>

          {/* Email Form */}
          <div className="md:w-1/2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email subject..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your message here..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || selectedUserIds.size === 0}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending ({sendProgress.sent}/{sendProgress.total})
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send to {selectedUserIds.size} user(s)
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
