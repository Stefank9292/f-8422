import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/AppSidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";

// Pages
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Subscribe from "@/pages/Subscribe";
import Success from "@/pages/Success";
import SearchHistory from "@/pages/SearchHistory";
import Profile from "@/pages/Profile";
import Transcribe from "@/pages/Transcribe";
import TikTokSearch from "@/pages/TikTokSearch";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <SidebarProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppSidebar />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Index />} />
                <Route path="subscribe" element={<Subscribe />} />
                <Route path="success" element={<Success />} />
                <Route path="history" element={<SearchHistory />} />
                <Route path="profile" element={<Profile />} />
                <Route path="transcribe" element={<Transcribe />} />
                <Route path="tiktok" element={<TikTokSearch />} />
              </Route>
            </Routes>
          </SidebarProvider>
        </Router>
        <Toaster />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;