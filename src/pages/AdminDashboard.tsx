import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { 
  Users, Shield, ArrowLeft, Search, Mail, Clock, Send, UserCog, BarChart3, 
  Download, UserX, RefreshCw, CreditCard, MoreHorizontal, Activity, TrendingUp,
  AlertTriangle, Crown, FileSpreadsheet, FileText, MessageSquare, Newspaper,
  ThumbsUp, Settings2, Eye, KeyRound, Loader2, History
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { useUserRole } from '@/hooks/useUserRole';
import { useAdminUsers, AdminUser } from '@/hooks/useAdminUsers';
import { useAdminSubscriptions } from '@/hooks/useAdminSubscriptions';
import { SendEmailDialog } from '@/components/SendEmailDialog';
import { BulkEmailDialog } from '@/components/BulkEmailDialog';
import { UserAnalyticsCharts } from '@/components/UserAnalyticsCharts';
import { RoleManagementDialog } from '@/components/RoleManagementDialog';
import { AdminSubscriptionDialog } from '@/components/AdminSubscriptionDialog';
import { AdminBlogManager } from '@/components/AdminBlogManager';
import { AdminContactMessages } from '@/components/AdminContactMessages';
import { AdminFeedback } from '@/components/AdminFeedback';
import { UserOverviewDialog } from '@/components/UserOverviewDialog';
import { AdminAuditLog } from '@/components/AdminAuditLog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { PLAN_LABELS } from '@/hooks/useSubscription';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { data: users, isLoading: usersLoading, refetch } = useAdminUsers();
  const { data: subscriptions, isLoading: subsLoading, refetch: refetchSubs } = useAdminSubscriptions();
  const [searchQuery, setSearchQuery] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [bulkEmailDialogOpen, setBulkEmailDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [overviewDialogOpen, setOverviewDialogOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [userPendingReset, setUserPendingReset] = useState<AdminUser | null>(null);
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const subscriptionMap = useMemo(() => {
    const map = new Map<string, typeof subscriptions extends (infer T)[] ? T : never>();
    subscriptions?.forEach(sub => map.set(sub.user_id, sub));
    return map;
  }, [subscriptions]);

  useEffect(() => {
    if (!roleLoading && !isAdmin) navigate('/dashboard');
  }, [isAdmin, roleLoading, navigate]);

  if (roleLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }
  if (!isAdmin) return null;

  const filteredUsers = users?.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUsers = users?.length || 0;
  const newThisWeek = users?.filter(u => new Date(u.created_at) > subDays(new Date(), 7)).length || 0;
  const newThisMonth = users?.filter(u => new Date(u.created_at) > subDays(new Date(), 30)).length || 0;
  const activeRecently = users?.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at) > subDays(new Date(), 7)).length || 0;
  const trialUsers = subscriptions?.filter(s => s.status === 'trial').length || 0;
  const paidUsers = subscriptions?.filter(s => s.status === 'active' && s.plan_type !== 'starter').length || 0;

  const handleRefreshAll = () => {
    refetch();
    refetchSubs();
    toast({ title: 'Refreshed', description: 'Data has been refreshed' });
  };

  const handleExportUsers = () => {
    if (!users) return;
    const csvContent = [
      ['Name', 'Email', 'Plan', 'Status', 'Joined', 'Last Active'].join(','),
      ...users.map(u => {
        const sub = subscriptionMap.get(u.user_id);
        return [
          `"${u.full_name || 'No name'}"`, u.email || 'No email',
          sub ? PLAN_LABELS[sub.plan_type] || sub.plan_type : 'None', sub?.status || 'N/A',
          format(new Date(u.created_at), 'yyyy-MM-dd'),
          u.last_sign_in_at ? format(new Date(u.last_sign_in_at), 'yyyy-MM-dd HH:mm') : 'Never'
        ].join(',');
      })
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FedhaFlow_Users_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export complete', description: `Exported ${users.length} users` });
  };

  const handleExportSubscriptions = () => {
    if (!subscriptions) return;
    const csvContent = [
      ['User ID', 'Plan', 'Status', 'Start', 'End', 'Billing'].join(','),
      ...subscriptions.map(s => [
        s.user_id, PLAN_LABELS[s.plan_type] || s.plan_type, s.status,
        format(new Date(s.current_period_start), 'yyyy-MM-dd'),
        format(new Date(s.current_period_end), 'yyyy-MM-dd'), s.billing_cycle
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FedhaFlow_Subscriptions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Export complete', description: `Exported ${subscriptions.length} subscriptions` });
  };

  const ALLOWED_RESET_HOSTS = ['localhost', '127.0.0.1', 'personalfinance-manager.lovable.app'];
  const ALLOWED_RESET_HOST_SUFFIXES = ['.lovable.app', '.lovableproject.com'];

  const buildResetRedirect = (): { url: string | null; error?: string } => {
    if (typeof window === 'undefined') return { url: null, error: 'Browser context unavailable' };
    try {
      const origin = new URL(window.location.origin);
      const isLocal = origin.hostname === 'localhost' || origin.hostname === '127.0.0.1';
      const protoOk = origin.protocol === 'https:' || (isLocal && origin.protocol === 'http:');
      const hostOk =
        ALLOWED_RESET_HOSTS.includes(origin.hostname) ||
        ALLOWED_RESET_HOST_SUFFIXES.some((s) => origin.hostname.endsWith(s));
      if (!protoOk || !hostOk) {
        return { url: null, error: `Unsupported environment for reset link (${origin.hostname})` };
      }
      return { url: `${origin.origin}/reset-password` };
    } catch {
      return { url: null, error: 'Could not determine current environment URL' };
    }
  };

  const requestResetPassword = (user: AdminUser) => {
    if (!user.email || resettingUserId) return;
    setUserPendingReset(user);
    setResetConfirmOpen(true);
  };

  const handleResetPassword = async (user: AdminUser) => {
    if (!user.email || resettingUserId) return;
    const { url: redirectTo, error: urlError } = buildResetRedirect();
    if (!redirectTo) {
      toast({ title: 'Invalid redirect URL', description: urlError, variant: 'destructive' });
      return;
    }
    setResettingUserId(user.user_id);
    try {
      const { data, error } = await supabase.functions.invoke('admin-reset-user-password', {
        body: { email: user.email, redirectTo },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: 'Reset email sent', description: `Password reset link sent to ${user.email}` });
      refetch();
    } catch (err: any) {
      toast({ title: 'Reset failed', description: err.message || 'Could not send reset email', variant: 'destructive' });
    } finally {
      setResettingUserId(null);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getActivityStatus = (lastSignIn: string | null) => {
    if (!lastSignIn) return { label: 'Never', variant: 'outline' as const };
    const date = new Date(lastSignIn);
    if (date > subDays(new Date(), 1)) return { label: 'Active', variant: 'default' as const };
    if (date > subDays(new Date(), 7)) return { label: 'Recent', variant: 'secondary' as const };
    return { label: 'Inactive', variant: 'outline' as const };
  };

  const getPlanBadgeVariant = (planType: string) => {
    switch (planType) {
      case 'enterprise': case 'business': return 'default' as const;
      case 'team': case 'premium': return 'secondary' as const;
      case 'pro': return 'default' as const;
      default: return 'outline' as const;
    }
  };

  const StatCard = ({ icon: Icon, label, value, trend, color }: { icon: any; label: string; value: number | string; trend?: string; color?: string }) => (
    <Card className="hover-lift border-border/50">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${color || 'bg-primary/10'}`}>
          <Icon className={`h-4 w-4 ${color ? 'text-primary-foreground' : 'text-primary'}`} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          <p className="text-xl font-bold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="h-9 w-9 shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-xs hidden sm:block">Platform management and oversight</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleRefreshAll} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid gap-3 grid-cols-2 lg:grid-cols-6">
          {usersLoading || subsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
            ))
          ) : (
            <>
              <StatCard icon={Users} label="Total Users" value={totalUsers} />
              <StatCard icon={TrendingUp} label="New (7d)" value={`+${newThisWeek}`} color="bg-accent" />
              <StatCard icon={Activity} label="New (30d)" value={`+${newThisMonth}`} color="bg-primary" />
              <StatCard icon={Clock} label="Active (7d)" value={activeRecently} />
              <StatCard icon={Crown} label="Paid Users" value={paidUsers} />
              <StatCard icon={AlertTriangle} label="On Trial" value={trialUsers} />
            </>
          )}
        </motion.div>

        {/* Main Tabbed Content */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="users" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <TabsList className="w-full sm:w-auto grid grid-cols-5 sm:inline-flex">
                <TabsTrigger value="users" className="gap-1.5 text-xs sm:text-sm">
                  <Users className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Users</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-1.5 text-xs sm:text-sm">
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="gap-1.5 text-xs sm:text-sm">
                  <Newspaper className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Content</span>
                </TabsTrigger>
                <TabsTrigger value="messages" className="gap-1.5 text-xs sm:text-sm">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Messages</span>
                </TabsTrigger>
                <TabsTrigger value="feedback" className="gap-1.5 text-xs sm:text-sm">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Feedback</span>
                </TabsTrigger>
              </TabsList>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <Button onClick={() => setBulkEmailDialogOpen(true)} size="sm" variant="default">
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  Bulk Email
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-1.5 h-3.5 w-3.5" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleExportUsers}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" /> Users (CSV)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportSubscriptions}>
                      <FileText className="mr-2 h-4 w-4" /> Subscriptions (CSV)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader className="p-4 pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        User Management
                        {filteredUsers && (
                          <Badge variant="secondary" className="text-xs">{filteredUsers.length}</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">View and manage all registered users</CardDescription>
                    </div>
                    <div className="relative w-full sm:w-56">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-8 h-9 text-sm" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 md:px-4 md:pb-4">
                  {usersLoading ? (
                    <div className="space-y-3 p-4">
                      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
                    </div>
                  ) : filteredUsers && filteredUsers.length > 0 ? (
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="min-w-[140px]">User</TableHead>
                            <TableHead className="hidden md:table-cell">Email</TableHead>
                            <TableHead className="hidden lg:table-cell">Plan</TableHead>
                            <TableHead className="hidden sm:table-cell">Joined</TableHead>
                            <TableHead className="hidden lg:table-cell">Status</TableHead>
                            <TableHead className="hidden xl:table-cell">Last Reset</TableHead>
                            <TableHead className="text-right w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => {
                            const status = getActivityStatus(user.last_sign_in_at);
                            const subscription = subscriptionMap.get(user.user_id);
                            return (
                              <TableRow key={user.id}>
                                <TableCell className="py-2">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={user.avatar_url || ''} />
                                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                        {getInitials(user.full_name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                      <p className="font-medium truncate text-sm">{user.full_name || 'No name'}</p>
                                      <p className="text-xs text-muted-foreground md:hidden truncate">{user.email || 'No email'}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{user.email || '—'}</TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  {subscription ? (
                                    <div className="flex items-center gap-1.5">
                                      <Badge variant={getPlanBadgeVariant(subscription.plan_type)} className="text-xs">
                                        {PLAN_LABELS[subscription.plan_type] || subscription.plan_type}
                                      </Badge>
                                      {subscription.status === 'trial' && (
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-400 text-amber-600">Trial</Badge>
                                      )}
                                      {subscription.status === 'cancelled' && (
                                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Cancelled</Badge>
                                      )}
                                    </div>
                                  ) : (
                                    <Badge variant="outline" className="text-xs">No Plan</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                                  {format(new Date(user.created_at), 'MMM d, yyyy')}
                                </TableCell>
                                <TableCell className="hidden lg:table-cell">
                                  <Badge variant={status.variant} className="text-xs">{status.label}</Badge>
                                </TableCell>
                                <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">
                                  {user.last_password_reset_at
                                    ? format(new Date(user.last_password_reset_at), 'MMM d, yyyy HH:mm')
                                    : '—'}
                                </TableCell>
                                <TableCell className="text-right py-2">
                                  <div className="flex items-center justify-end gap-1" role="group" aria-label={`Actions for ${user.full_name || 'user'}`}>
                                    <div className="hidden lg:flex items-center gap-1">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => { setSelectedUser(user); setOverviewDialogOpen(true); }}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedUser(user); setOverviewDialogOpen(true); } }}
                                            className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                                            aria-label={`View overview for ${user.full_name || 'user'}`}
                                          >
                                            <Eye className="h-4 w-4" aria-hidden="true" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>View user overview</TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => { setSelectedUser(user); setSubscriptionDialogOpen(true); }}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedUser(user); setSubscriptionDialogOpen(true); } }}
                                            className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                                            aria-label={`Manage subscription for ${user.full_name || 'user'}`}
                                          >
                                            <Crown className="h-4 w-4" aria-hidden="true" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Manage subscription</TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            disabled={!user.email || resettingUserId === user.user_id}
                                            onClick={() => requestResetPassword(user)}
                                            className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                                            aria-label={`Reset password for ${user.full_name || 'user'}`}
                                          >
                                            {resettingUserId === user.user_id ? (
                                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                            ) : (
                                              <KeyRound className="h-4 w-4" aria-hidden="true" />
                                            )}
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          {user.email
                                            ? user.last_password_reset_at
                                              ? `Last reset: ${format(new Date(user.last_password_reset_at), 'MMM d, yyyy HH:mm')}`
                                              : 'Send password reset email'
                                            : 'No email on file'}
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                                              aria-label={`More actions for ${user.full_name || 'user'}`}
                                            >
                                              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>More actions</TooltipContent>
                                        </Tooltip>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel className="text-xs">User Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setOverviewDialogOpen(true); }} className="lg:hidden">
                                          <Eye className="mr-2 h-4 w-4" /> View Overview
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setSubscriptionDialogOpen(true); }} className="lg:hidden">
                                          <Crown className="mr-2 h-4 w-4" /> Manage Subscription
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setRoleDialogOpen(true); }}>
                                          <UserCog className="mr-2 h-4 w-4" /> Manage Roles
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setEmailDialogOpen(true); }} disabled={!user.email}>
                                          <Mail className="mr-2 h-4 w-4" /> Send Email
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          disabled={!user.email || resettingUserId === user.user_id}
                                          onSelect={(e) => {
                                            e.preventDefault();
                                            handleResetPassword(user);
                                          }}
                                        >
                                          {resettingUserId === user.user_id ? (
                                            <>
                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending reset email...
                                            </>
                                          ) : (
                                            <>
                                              <KeyRound className="mr-2 h-4 w-4" /> Reset Password
                                            </>
                                          )}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => {
                                          navigator.clipboard.writeText(user.user_id);
                                          toast({ title: 'Copied', description: 'User ID copied' });
                                        }}>
                                          <CreditCard className="mr-2 h-4 w-4" /> Copy User ID
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setDeleteDialogOpen(true); }} className="text-destructive focus:text-destructive">
                                          <UserX className="mr-2 h-4 w-4" /> Delete User
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No users found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              {!usersLoading && users ? (
                <UserAnalyticsCharts users={users} />
              ) : (
                <Card><CardContent className="p-8 text-center text-muted-foreground">Loading analytics...</CardContent></Card>
              )}
            </TabsContent>

            {/* Content Tab */}
            <TabsContent value="content">
              <AdminBlogManager />
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <AdminContactMessages />
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback">
              <AdminFeedback />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>

      {/* Dialogs */}
      {selectedUser && (
        <>
          <SendEmailDialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen} userEmail={selectedUser.email || ''} userName={selectedUser.full_name} />
          <RoleManagementDialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen} userId={selectedUser.user_id} userName={selectedUser.full_name} />
          <AdminSubscriptionDialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen} userId={selectedUser.user_id} userName={selectedUser.full_name} currentSubscription={subscriptionMap.get(selectedUser.user_id)} />
          <UserOverviewDialog
            open={overviewDialogOpen}
            onOpenChange={setOverviewDialogOpen}
            userId={selectedUser.user_id}
            userName={selectedUser.full_name}
            userEmail={selectedUser.email}
            avatarUrl={selectedUser.avatar_url}
          />
        </>
      )}
      {users && <BulkEmailDialog open={bulkEmailDialogOpen} onOpenChange={setBulkEmailDialogOpen} users={users} />}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" /> Delete User
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedUser?.full_name || 'this user'}</strong>? This will permanently remove their account and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={async () => {
              if (!selectedUser) return;
              try {
                const { error } = await supabase.functions.invoke('delete-user', {
                  body: { userId: selectedUser.user_id },
                });
                if (error) throw error;
                toast({ title: 'User deleted', description: `${selectedUser.full_name || 'User'} has been removed.` });
                refetch();
                refetchSubs();
              } catch (err: any) {
                toast({ title: 'Deletion failed', description: err.message || 'Could not delete user', variant: 'destructive' });
              }
              setDeleteDialogOpen(false);
            }}>
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
