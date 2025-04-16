
import { AdminSidebar } from "@/components/admin-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <main className="pt-4 lg:pl-[280px] min-h-screen">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-end mb-4">
              <ThemeToggle />
            </div>
            {children}
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
