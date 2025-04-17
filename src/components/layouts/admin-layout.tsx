
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminSidebar } from "@/components/admin-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Check if user is authenticated
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // This prevents hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <main className="pt-4 lg:pl-[280px] min-h-screen">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between mb-4">
              <div>
                {user && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-2">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                {user && (
                  <Button variant="outline" size="sm" onClick={() => logout()}>
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                )}
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
