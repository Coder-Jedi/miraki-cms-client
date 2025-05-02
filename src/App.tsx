import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/theme-provider";
import { ProtectedRoute } from "@/components/protected-route";

// Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin pages
import { AdminLayout } from "./components/layouts/admin-layout";
import Dashboard from "./pages/admin/Dashboard";
import Artworks from "./pages/admin/Artworks";
import Artists from "./pages/admin/Artists";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import ContentBanners from "./pages/admin/ContentBanners";
import ContentCollections from "./pages/admin/ContentCollections";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="miraki-ui-theme">
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/artworks" element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Artworks />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/artists" element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Artists />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Orders />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Users />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/content/banners" element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ContentBanners />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/content/collections" element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <ContentCollections />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Settings />
                    </AdminLayout>
                  </ProtectedRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
