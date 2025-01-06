import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/sidebar/SidebarTrigger";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ResetPassword } from "@/components/auth/ResetPassword";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Subscribe from "@/pages/Subscribe";
import Success from "@/pages/Success";
import FAQ from "@/pages/FAQ";
import HelpCenter from "@/pages/HelpCenter";
import SearchHistory from "@/pages/SearchHistory";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
      retry: 3, // Retry failed requests 3 times
      refetchOnWindowFocus: true, // Enable refetch on window focus
      refetchOnReconnect: true, // Enable refetch on reconnect
      refetchOnMount: true, // Enable refetch on component mount
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <SidebarProvider defaultOpen>
            <div className="min-h-screen flex w-full animate-in fade-in duration-200">
              <AppSidebar />
              <SidebarTrigger />
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/reset-password" element={<ResetPassword />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/subscribe"
                    element={
                      <ProtectedRoute>
                        <Subscribe />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/success"
                    element={
                      <ProtectedRoute>
                        <Success />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/faq"
                    element={
                      <ProtectedRoute>
                        <FAQ />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/help"
                    element={
                      <ProtectedRoute>
                        <HelpCenter />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <SearchHistory />
                      </ProtectedRoute>
                    }
                  />
                  {/* Catch all route - redirect to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;