import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Users, Shield, ArrowLeft, Search, Mail, Clock, Send, UserCog, BarChart3, 
  Download, UserX, RefreshCw, CreditCard, MoreHorizontal, Activity, TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { format, formatDistanceToNow, subDays } from 'date-fns';
import { Layout } from '@/components/Layout';
import { useUserRole } from '@/hooks/useUserRole';
import { useAdminUsers, AdminUser } from '@/hooks/useAdminUsers';
import { SendEmailDialog } from '@/components/SendEmailDialog';
import { BulkEmailDialog } from '@/components/BulkEmailDialog';
import { UserAnalyticsCharts } from '@/components/UserAnalyticsCharts';
import { UserFinancialsDialog } from '@/components/UserFinancialsDialog';
import { RoleManagementDialog } from '@/components/RoleManagementDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [bulkEmailDialogOpen, setBulkEmailDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [financialsDialogOpen, setFinancialsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

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

  const handleDeleteClick = (user: AdminUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleExportUsers = () => {
    if (!users) return;
    
    const csvContent = [
      ['Name', 'Email', 'Joined', 'Last Active'].join(','),
      ...users.map(u => [
        u.full_name || 'No name',
        u.email || 'No email',
        format(new Date(u.created_at), 'yyyy-MM-dd'),
        u.last_sign_in_at ? format(new Date(u.last_sign_in_at), 'yyyy-MM-dd HH:mm') : 'Never'
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export complete',
      description: `Exported ${users.length} users to CSV`,
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

  return (
    <Layout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage users, analytics, and platform settings
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setBulkEmailDialogOpen(true)} size="sm">
              <Send className="mr-2 h-4 w-4" />
              Bulk Email
            </Button>
            <Button onClick={handleExportUsers} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Users
            </Button>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-xl sm:text-2xl font-bold">{totalUsers}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                New This Week
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-xl sm:text-2xl font-bold text-green-600">{newThisWeek}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                New This Month
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{newThisMonth}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
                Active (7d)
              </CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-xl sm:text-2xl font-bold text-amber-600">{activeRecently}</div>
              )}
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
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users className="h-5 w-5" />
                  Registered Users
                  {filteredUsers && (
                    <Badge variant="secondary" className="ml-2">
                      {filteredUsers.length}
                    </Badge>
                  )}
                </CardTitle>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              {usersLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredUsers && filteredUsers.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">User</TableHead>
                        <TableHead className="hidden lg:table-cell">Email</TableHead>
                        <TableHead className="hidden sm:table-cell">Joined</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        const status = getActivityStatus(user.last_sign_in_at);
                        return (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                                  <AvatarImage src={user.avatar_url || ''} />
                                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                    {getInitials(user.full_name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="font-medium truncate text-sm">
                                    {user.full_name || 'No name'}
                                  </p>
                                  <p className="text-xs text-muted-foreground lg:hidden truncate">
                                    {user.email || 'No email'}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                              {user.email || '—'}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                              {format(new Date(user.created_at), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="secondary" className={`${status.color} text-xs`}>
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {/* Desktop: Show individual buttons */}
                                <div className="hidden sm:flex items-center gap-1">
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
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRoleClick(user)}
                                        className="h-8 w-8"
                                      >
                                        <UserCog className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Manage roles</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEmailClick(user)}
                                        disabled={!user.email}
                                        className="h-8 w-8"
                                      >
                                        <Mail className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {user.email ? 'Send email' : 'No email'}
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                                
                                {/* Mobile & Desktop: Dropdown menu */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleFinancialsClick(user)} className="sm:hidden">
                                      <BarChart3 className="mr-2 h-4 w-4" />
                                      View Financials
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRoleClick(user)} className="sm:hidden">
                                      <UserCog className="mr-2 h-4 w-4" />
                                      Manage Roles
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleEmailClick(user)} 
                                      disabled={!user.email}
                                      className="sm:hidden"
                                    >
                                      <Mail className="mr-2 h-4 w-4" />
                                      Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="sm:hidden" />
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
      </motion.div>
    </Layout>
  );
}