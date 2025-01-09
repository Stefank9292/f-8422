import { Navigate, useLocation } from "react-router-dom";
import { useSessionValidation } from "@/hooks/useSessionValidation";
import { LoadingState } from "@/components/auth/LoadingState";
import { ErrorState } from "@/components/auth/ErrorState";
import { UndefinedSessionState } from "@/components/auth/UndefinedSessionState";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { session, isLoading, error } = useSessionValidation();

  // Show loading state only if we're loading the initial session
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  // Handle undefined session state
  if (session === undefined) {
    return <UndefinedSessionState onRefresh={() => window.location.reload()} />;
  }

  // If no session, redirect to auth
  if (!session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};