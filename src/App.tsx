import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ResetPassword } from "@/components/auth/ResetPassword";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Subscribe from "@/pages/Subscribe";
import Success from "@/pages/Success";
import FAQ from "@/pages/FAQ";
import HelpCenter from "@/pages/HelpCenter";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data remains fresh for 5 minutes
      gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
      retry: 3, // Retry failed requests 3 times
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: false, // Don't refetch on reconnect
      refetchOnMount: false, // Don't refetch on component mount
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SidebarProvider defaultOpen>
          <div className="min-h-screen flex w-full animate-in fade-in duration-200">
            <AppSidebar />
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
              </Routes>
            </main>
          </div>
        </SidebarProvider>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;