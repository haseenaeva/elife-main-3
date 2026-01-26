import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useSuperAdminStats } from "@/hooks/useSuperAdminStats";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link, Navigate } from "react-router-dom";
import { 
  Shield, 
  Users, 
  Building2, 
  Calendar,
  ClipboardList,
  Activity,
  LogOut,
  Loader2,
  UserCheck,
  UserX,
  TrendingUp,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

export default function SuperAdminDashboard() {
  const { isSuperAdmin, signOut, user } = useAuth();
  const stats = useSuperAdminStats();
  const { toast } = useToast();

  // Redirect non-super-admins
  if (!isSuperAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  const handleToggleAdmin = async (adminId: string, currentStatus: boolean, adminName: string) => {
    try {
      await stats.toggleAdminStatus(adminId, currentStatus);
      toast({
        title: "Status Updated",
        description: `${adminName} has been ${!currentStatus ? "activated" : "deactivated"}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update admin status",
        variant: "destructive",
      });
    }
  };

  if (stats.isLoading) {
    return (
      <Layout>
        <div className="container py-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">
              System-wide overview and management
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-sm font-medium">
              <Shield className="h-4 w-4" />
              Super Admin
            </span>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Admins"
            value={stats.totalAdmins}
            description={`${stats.activeAdmins} active`}
            icon={Shield}
          />
          <StatsCard
            title="Total Divisions"
            value={stats.totalDivisions}
            description={`${stats.activeDivisions} active`}
            icon={Building2}
          />
          <StatsCard
            title="Total Programs"
            value={stats.totalPrograms}
            description={`${stats.activePrograms} active`}
            icon={Calendar}
          />
          <StatsCard
            title="Total Registrations"
            value={stats.totalRegistrations}
            icon={ClipboardList}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Button asChild variant="outline" className="h-auto py-4">
            <Link to="/admin/admins" className="flex flex-col items-center gap-2">
              <Shield className="h-6 w-6" />
              <span>Manage Admins</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4">
            <Link to="/admin/divisions" className="flex flex-col items-center gap-2">
              <Building2 className="h-6 w-6" />
              <span>Manage Divisions</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4">
            <Link to="/admin/programs" className="flex flex-col items-center gap-2">
              <Calendar className="h-6 w-6" />
              <span>All Programs</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4">
            <Link to="/admin/members" className="flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>All Members</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4">
            <Link to="/admin/locations" className="flex flex-col items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>Locations</span>
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Admins Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  All Admins
                </CardTitle>
                <CardDescription>
                  Manage division administrators
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/admins">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {stats.admins.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No admins found
                </p>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {stats.admins.slice(0, 5).map((admin) => (
                    <div key={admin.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {admin.profile?.full_name || "N/A"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {admin.division?.name || "No Division"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant={admin.is_active ? "default" : "secondary"}>
                          {admin.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAdmin(
                            admin.id, 
                            admin.is_active ?? true,
                            admin.profile?.full_name || "Admin"
                          )}
                        >
                          {admin.is_active ? (
                            <UserX className="h-4 w-4 text-destructive" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Divisions Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  All Divisions
                </CardTitle>
                <CardDescription>
                  Division performance overview
                </CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/divisions">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {stats.divisions.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No divisions found
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Division</TableHead>
                      <TableHead className="text-right">Programs</TableHead>
                      <TableHead className="text-right">Members</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.divisions.slice(0, 5).map((div) => (
                      <TableRow key={div.id}>
                        <TableCell className="font-medium">{div.name}</TableCell>
                        <TableCell className="text-right">{div.programCount}</TableCell>
                        <TableCell className="text-right">{div.memberCount}</TableCell>
                        <TableCell>
                          <Badge variant={div.is_active ? "default" : "secondary"} className="text-xs">
                            {div.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system activity logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">
                No recent activity
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border">
                    <div className={`p-2 rounded-full ${
                      activity.type === "registration" 
                        ? "bg-green-100 dark:bg-green-900/30" 
                        : activity.type === "program"
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : "bg-amber-100 dark:bg-amber-900/30"
                    }`}>
                      {activity.type === "registration" ? (
                        <ClipboardList className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : activity.type === "program" ? (
                        <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {stats.error && (
          <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg">
            Error loading stats: {stats.error}
          </div>
        )}
      </div>
    </Layout>
  );
}
