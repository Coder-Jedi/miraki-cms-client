
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Palette,
  Users,
  ShoppingCart,
  User,
  LayoutList,
  Settings,
  Image,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarLink = ({ to, icon, label, isActive }: SidebarLinkProps) => (
  <Link to={to} className="w-full">
    <Button
      variant={isActive ? "default" : "ghost"}
      size="lg"
      className={cn(
        "w-full justify-start gap-3 font-medium",
        isActive
          ? "bg-primary text-primary-foreground"
          : "hover:bg-secondary hover:text-secondary-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  </Link>
);

export function AdminSidebar() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const navigationItems = [
    {
      to: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      to: "/admin/artworks",
      icon: <Palette className="h-5 w-5" />,
      label: "Artworks",
    },
    {
      to: "/admin/artists",
      icon: <Users className="h-5 w-5" />,
      label: "Artists",
    },
    {
      to: "/admin/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Orders",
    },
    {
      to: "/admin/users",
      icon: <User className="h-5 w-5" />,
      label: "Users",
    },
    {
      to: "/admin/content/banners",
      icon: <Image className="h-5 w-5" />,
      label: "Banners",
    },
    {
      to: "/admin/content/collections",
      icon: <LayoutList className="h-5 w-5" />,
      label: "Collections",
    },
    {
      to: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
    },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed left-4 top-4 z-50 lg:hidden",
          sidebarOpen && "left-[270px]"
        )}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-[280px] flex-shrink-0 bg-sidebar border-r border-border transition-transform duration-300 ease-in-out",
          isMobile && !sidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-border px-4">
            <Link to="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Palette className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Miraki Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.to}
                />
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
