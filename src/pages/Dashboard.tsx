import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { isSuperAdmin, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Route to appropriate dashboard based on role
  if (isSuperAdmin) {
    return <Navigate to="/super-admin" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  // Non-admin users go to unauthorized
  return <Navigate to="/unauthorized" replace />;
}
