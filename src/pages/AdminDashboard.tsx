import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { 
  Users, Shield, ArrowLeft, Search, Mail, Clock, Send, UserCog, BarChart3, 
  Download, UserX, RefreshCw, CreditCard, MoreHorizontal, Activity, TrendingUp,
  AlertTriangle, Crown, FileSpreadsheet, FileText, Calendar
} from 'lucide-react';
import { format, formatDistanceToNow, subDays } from 'date-fns';
import { Layout } from '@/components/Layout';
import { useUserRole } from '@/hooks/useUserRole';
import { useAdminUsers, AdminUser } from '@/hooks/useAdminUsers';
import { useAdminSubscriptions } from '@/hooks/useAdminSubscriptions';
import { SendEmailDialog } from '@/components/SendEmailDialog';
import { BulkEmailDialog } from '@/components/BulkEmailDialog';
import { UserAnalyticsCharts } from '@/components/UserAnalyticsCharts';
import { UserFinancialsDialog } from '@/components/UserFinancialsDialog';
import { RoleManagementDialog } from '@/components/RoleManagementDialog';
import { AdminSubscriptionDialog } from '@/components/AdminSubscriptionDialog';
import { AdminBlogManager } from '@/components/AdminBlogManager';
import { AdminContactMessages } from '@/components/AdminContactMessages';
import { AdminFeedback } from '@/components/AdminFeedback';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { PLAN_LABELS } from '@/hooks/useSubscription';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
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
  const [financialsDialogOpen, setFinancialsDialogOpen] = useState(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Create a map of user subscriptions
  const subscriptionMap = useMemo(() => {
    const map = new Map<string, typeof subscriptions extends (infer T)[] ? T : never>();
    subscriptions?.forEach(sub => map.set(sub.user_id, sub));
    return map;
  }, [subscriptions]);

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, roleLoading, navigate]);

  if (roleLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const filteredUsers = users?.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalUsers = users?.length || 0;
  const newThisWeek = users?.filter((u) => {
    const weekAgo = subDays(new Date(), 7);
    return new Date(u.created_at) > weekAgo;
  }).length || 0;
  const newThisMonth = users?.filter((u) => {
    const monthAgo = subDays(new Date(), 30);
    return new Date(u.created_at) > monthAgo;
  }).length || 0;
  const activeRecently = users?.filter((u) => {
    if (!u.last_sign_in_at) return false;
    const weekAgo = subDays(new Date(), 7);
    return new Date(u.last_sign_in_at) > weekAgo;
  }).length || 0;

  // Subscription stats
  const activeSubscriptions = subscriptions?.filter(s => s.status === 'active').length || 0;
  const trialUsers = subscriptions?.filter(s => s.status === 'trial').length || 0;
  const paidUsers = subscriptions?.filter(s => s.status === 'active' && s.plan_type !== 'starter').length || 0;

  const handleEmailClick = (user: AdminUser) => {
    setSelectedUser(user);
    setEmailDialogOpen(true);
  };

  const handleRoleClick = (user: AdminUser) => {
    setSelectedUser(user);
    setRoleDialogOpen(true);
  };

  const handleFinancialsClick = (user: AdminUser) => {
    setSelectedUser(user);
    setFinancialsDialogOpen(true);
  };

  const handleSubscriptionClick = (user: AdminUser) => {
    setSelectedUser(user);
    setSubscriptionDialogOpen(true);
  };

  const handleDeleteClick = (user: AdminUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

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
          `"${u.full_name || 'No name'}"`,
          u.email || 'No email',
          sub ? PLAN_LABELS[sub.plan_type] || sub.plan_type : 'None',
          sub?.status || 'N/A',
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
    
    toast({
      title: 'Export complete',
      description: `Exported ${users.length} users to CSV`,
    });
  };

  const handleExportSubscriptions = () => {
    if (!subscriptions) return;
    
    const csvContent = [
      ['User ID', 'Plan', 'Status', 'Start Date', 'End Date', 'Billing Cycle'].join(','),
      ...subscriptions.map(s => [
        s.user_id,
        PLAN_LABELS[s.plan_type] || s.plan_type,
        s.status,
        format(new Date(s.current_period_start), 'yyyy-MM-dd'),
        format(new Date(s.current_period_end), 'yyyy-MM-dd'),
        s.billing_cycle
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FedhaFlow_Subscriptions_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export complete',
      description: `Exported ${subscriptions.length} subscriptions to CSV`,
    });
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

  const getActivityStatus = (lastSignIn: string | null) => {
    if (!lastSignIn) return { label: 'Never', color: 'bg-muted text-muted-foreground' };
    const date = new Date(lastSignIn);
    const dayAgo = subDays(new Date(), 1);
    const weekAgo = subDays(new Date(), 7);
    
    if (date > dayAgo) return { label: 'Active', color: 'bg-green-500/20 text-green-600' };
    if (date > weekAgo) return { label: 'Recent', color: 'bg-yellow-500/20 text-yellow-600' };
    return { label: 'Inactive', color: 'bg-muted text-muted-foreground' };
  };

  const getPlanBadgeColor = (planType: string) => {
    switch (planType) {
      case 'enterprise':
      case 'business':
        return 'bg-purple-500/20 text-purple-600';
      case 'team':
      case 'premium':
        return 'bg-amber-500/20 text-amber-600';
      case 'pro':
        return 'bg-blue-500/20 text-blue-600';
      case 'plus':
        return 'bg-green-500/20 text-green-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 md:space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
                className="shrink-0 h-9 w-9"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground text-xs md:text-sm hidden sm:block">
                  Manage users, subscriptions, and platform settings
                </p>
              </div>
            </div>
            <Button onClick={handleRefreshAll} variant="outline" size="sm" className="shrink-0">
              <RefreshCw className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Refresh</span>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards - 2x3 grid on mobile, 1x6 on desktop */}
        <motion.div variants={itemVariants} className="grid gap-3 grid-cols-2 lg:grid-cols-6">
          <Card className="col-span-1">
            <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Total </span>Users
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
              {usersLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <div className="text-lg md:text-2xl font-bold">{totalUsers}</div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                New (7d)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
              {usersLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <div className="text-lg md:text-2xl font-bold text-green-600">+{newThisWeek}</div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Activity className="h-3.5 w-3.5 text-blue-500" />
                New (30d)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
              {usersLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <div className="text-lg md:text-2xl font-bold text-blue-600">+{newThisMonth}</div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                Active (7d)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
              {usersLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <div className="text-lg md:text-2xl font-bold text-amber-600">{activeRecently}</div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Crown className="h-3.5 w-3.5 text-purple-500" />
                Active Subs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
              {subsLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <div className="text-lg md:text-2xl font-bold text-purple-600">{activeSubscriptions}</div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader className="p-3 md:p-4 pb-1 md:pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                On Trial
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 pt-0 md:pt-0">
              {subsLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                <div className="text-lg md:text-2xl font-bold text-amber-600">{trialUsers}</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setBulkEmailDialogOpen(true)} size="sm" variant="default">
                  <Send className="mr-2 h-4 w-4" />
                  Bulk Email
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleExportUsers}>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Export Users (CSV)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportSubscriptions}>
                      <FileText className="mr-2 h-4 w-4" />
                      Export Subscriptions (CSV)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analytics Charts */}
        {!usersLoading && users && (
          <motion.div variants={itemVariants}>
            <UserAnalyticsCharts users={users} />
          </motion.div>
        )}

        {/* Users Table */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-4 w-4" />
                    User Management
                    {filteredUsers && (
                      <Badge variant="secondary" className="ml-1">
                        {filteredUsers.length}
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    View and manage all registered users
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-9 text-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 md:px-4 md:pb-4">
              {usersLoading ? (
                <div className="space-y-3 p-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
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
                                  <p className="font-medium truncate text-sm">
                                    {user.full_name || 'No name'}
                                  </p>
                                  <p className="text-xs text-muted-foreground md:hidden truncate">
                                    {user.email || 'No email'}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                              {user.email || '—'}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {subscription ? (
                                <Badge 
                                  variant="secondary" 
                                  className={`${getPlanBadgeColor(subscription.plan_type)} text-xs`}
                                >
                                  {PLAN_LABELS[subscription.plan_type] || subscription.plan_type}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">No Plan</Badge>
                              )}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                              {format(new Date(user.created_at), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Badge variant="secondary" className={`${status.color} text-xs`}>
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right py-2">
                              <div className="flex items-center justify-end gap-1">
                                {/* Desktop: Show key buttons */}
                                <div className="hidden lg:flex items-center gap-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleSubscriptionClick(user)}
                                        className="h-8 w-8"
                                      >
                                        <Crown className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Manage subscription</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleFinancialsClick(user)}
                                        className="h-8 w-8"
                                      >
                                        <BarChart3 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>View financials</TooltipContent>
                                  </Tooltip>
                                </div>
                                
                                {/* All screens: Dropdown menu */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuLabel className="text-xs">User Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleSubscriptionClick(user)} className="lg:hidden">
                                      <Crown className="mr-2 h-4 w-4" />
                                      Manage Subscription
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleFinancialsClick(user)} className="lg:hidden">
                                      <BarChart3 className="mr-2 h-4 w-4" />
                                      View Financials
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRoleClick(user)}>
                                      <UserCog className="mr-2 h-4 w-4" />
                                      Manage Roles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleEmailClick(user)} 
                                      disabled={!user.email}
                                    >
                                      <Mail className="mr-2 h-4 w-4" />
                                      Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => {
                                      navigator.clipboard.writeText(user.user_id);
                                      toast({ title: 'Copied', description: 'User ID copied to clipboard' });
                                    }}>
                                      <CreditCard className="mr-2 h-4 w-4" />
                                      Copy User ID
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteClick(user)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <UserX className="mr-2 h-4 w-4" />
                                      Delete User
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
        </motion.div>

        {/* Email Dialog */}
        {selectedUser && (
          <SendEmailDialog
            open={emailDialogOpen}
            onOpenChange={setEmailDialogOpen}
            userEmail={selectedUser.email || ''}
            userName={selectedUser.full_name}
          />
        )}

        {/* Bulk Email Dialog */}
        {users && (
          <BulkEmailDialog
            open={bulkEmailDialogOpen}
            onOpenChange={setBulkEmailDialogOpen}
            users={users}
          />
        )}

        {/* Role Management Dialog */}
        {selectedUser && (
          <RoleManagementDialog
            open={roleDialogOpen}
            onOpenChange={setRoleDialogOpen}
            userId={selectedUser.user_id}
            userName={selectedUser.full_name}
          />
        )}

        {/* User Financials Dialog */}
        {selectedUser && (
          <UserFinancialsDialog
            open={financialsDialogOpen}
            onOpenChange={setFinancialsDialogOpen}
            userId={selectedUser.user_id}
            userName={selectedUser.full_name}
          />
        )}

        {/* Subscription Management Dialog */}
        {selectedUser && (
          <AdminSubscriptionDialog
            open={subscriptionDialogOpen}
            onOpenChange={setSubscriptionDialogOpen}
            userId={selectedUser.user_id}
            userName={selectedUser.full_name}
            currentSubscription={subscriptionMap.get(selectedUser.user_id)}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Delete User
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{selectedUser?.full_name || 'this user'}</strong>? 
                This action cannot be undone and will remove all their data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => {
                  toast({
                    title: 'Not implemented',
                    description: 'User deletion requires backend implementation for security.',
                    variant: 'destructive',
                  });
                  setDeleteDialogOpen(false);
                }}
              >
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Blog, Contact Messages, and Feedback Sections */}
        <motion.div variants={itemVariants} className="space-y-6">
          <AdminBlogManager />
          <AdminContactMessages />
          <AdminFeedback />
        </motion.div>
      </motion.div>
    </Layout>
  );
}
