import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseProvider } from "./providers/SupabaseProvider";
import AuthGuard from "./components/AuthGuard";

// Auth Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

// User Pages
import Dashboard from "./pages/Dashboard/Dashboard";

// Admin Pages
import AdminDashboard from "./pages/Admin/AdminDashboard";

// Other Pages
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected User Routes */}
            <Route path="/" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />
            <Route path="/dashboard" element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <AuthGuard requiredRole="admin">
                <AdminDashboard />
              </AuthGuard>
            } />

            {/* Catch All Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseProvider>
  </QueryClientProvider>
);

export default App;
