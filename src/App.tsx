import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/AppSidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Pages
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import Subscribe from "@/pages/Subscribe";
import Success from "@/pages/Success";
import SearchHistory from "@/pages/SearchHistory";
import Profile from "@/pages/Profile";
import Transcribe from "@/pages/Transcribe";
import TikTokSearch from "@/pages/TikTokSearch";

function App() {
  return (
    <ErrorBoundary>
      <Router>
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
      </Router>
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;