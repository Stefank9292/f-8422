import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import SubscribePage from "./pages/Subscribe";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {!isAuthPage && <AppSidebar />}
        <main className={`flex-1 p-4 ${isAuthPage ? 'w-full' : ''}`}>
          {!isAuthPage && <SidebarTrigger className="mb-4" />}
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/subscribe"
              element={
                <ProtectedRoute>
                  <SubscribePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;