import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useAdminStats } from "@/hooks/useAdminStats";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Calendar, 
  Users, 
  ClipboardList, 
  TrendingUp,
  MapPin,
  Layers,
  ArrowRight,
  LogOut,
  Shield,
  Loader2,
  Building2
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DivisionInfo {
  id: string;
  name: string;
  description: string | null;
}

export default function AdminDashboard() {
  const { isAdmin, isSuperAdmin, signOut, adminData, adminToken, user } = useAuth();
  const stats = useAdminStats();
  const [divisionInfo, setDivisionInfo] = useState<DivisionInfo | null>(null);

  useEffect(() => {
    const fetchDivisionInfo = async () => {
      if (adminData?.division_id) {
        const { data } = await supabase
          .from("divisions")
          .select("id, name, description")
          .eq("id", adminData.division_id)
          .maybeSingle();
        
        if (data) {
          setDivisionInfo(data);
        }
      }
    };

    fetchDivisionInfo();
  }, [adminData]);

  // Redirect super admins to their dashboard
  if (isSuperAdmin) {
    return <Navigate to="/super-admin" replace />;
  }

  // Redirect non-admins
  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  const getDisplayName = () => {
    if (adminToken && divisionInfo) {
      return `Admin - ${divisionInfo.name}`;
    }
    return user?.email || "User";
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
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {getDisplayName()}
            </p>
            {divisionInfo && (
              <div className="flex items-center gap-2 mt-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">
                  {divisionInfo.name}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Shield className="h-4 w-4" />
              Admin
            </span>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
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
          <StatsCard
            title="Active Programs"
            value={stats.activePrograms}
            icon={TrendingUp}
          />
          <StatsCard
            title="Total Members"
            value={stats.totalMembers}
            icon={Users}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Button asChild variant="outline" className="h-auto py-4">
            <Link to="/admin/programs" className="flex flex-col items-center gap-2">
              <Calendar className="h-6 w-6" />
              <span>Manage Programs</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4">
            <Link to="/admin/members" className="flex flex-col items-center gap-2">
              <Users className="h-6 w-6" />
              <span>Manage Members</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-auto py-4">
            <Link to="/admin/clusters" className="flex flex-col items-center gap-2">
              <Layers className="h-6 w-6" />
              <span>Manage Clusters</span>
            </Link>
          </Button>
          <Button asChild className="h-auto py-4">
            <Link to="/admin/programs" className="flex flex-col items-center gap-2">
              <ArrowRight className="h-6 w-6" />
              <span>Create New Program</span>
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Panchayath-wise Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Panchayath-wise Stats
              </CardTitle>
              <CardDescription>
                Programs and registrations by panchayath
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.panchayathStats.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No data available
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Panchayath</TableHead>
                      <TableHead className="text-right">Programs</TableHead>
                      <TableHead className="text-right">Registrations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.panchayathStats.slice(0, 5).map((stat) => (
                      <TableRow key={stat.id}>
                        <TableCell className="font-medium">{stat.name}</TableCell>
                        <TableCell className="text-right">{stat.programs}</TableCell>
                        <TableCell className="text-right">{stat.registrations}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Cluster-wise Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Cluster-wise Stats
              </CardTitle>
              <CardDescription>
                Member distribution by cluster
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.clusterStats.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">
                  No data available
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cluster</TableHead>
                      <TableHead>Panchayath</TableHead>
                      <TableHead className="text-right">Members</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.clusterStats.slice(0, 5).map((stat) => (
                      <TableRow key={stat.id}>
                        <TableCell className="font-medium">{stat.name}</TableCell>
                        <TableCell className="text-muted-foreground">{stat.panchayath_name}</TableCell>
                        <TableCell className="text-right">{stat.members}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {stats.error && (
          <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg">
            Error loading stats: {stats.error}
          </div>
        )}
      </div>
    </Layout>
  );
}
