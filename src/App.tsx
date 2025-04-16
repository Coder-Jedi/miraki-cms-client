import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/layouts/admin-layout";

// Admin pages
import Dashboard from "./pages/admin/Dashboard";
import Artworks from "./pages/admin/Artworks";
import Artists from "./pages/admin/Artists";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import ContentBanners from "./pages/admin/ContentBanners";
import ContentCollections from "./pages/admin/ContentCollections";
import Settings from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/admin/artworks" element={<AdminLayout><Artworks /></AdminLayout>} />
          <Route path="/admin/artists" element={<AdminLayout><Artists /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><Orders /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><Users /></AdminLayout>} />
          <Route path="/admin/content/banners" element={<AdminLayout><ContentBanners /></AdminLayout>} />
          <Route path="/admin/content/collections" element={<AdminLayout><ContentCollections /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><Settings /></AdminLayout>} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
