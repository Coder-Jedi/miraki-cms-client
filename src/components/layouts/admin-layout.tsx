import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  PaintBucket,
  Users as UsersIcon,
  ShoppingCart,
  Image,
  Grid3X3,
  Settings as SettingsIcon,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Artworks", href: "/admin/artworks", icon: PaintBucket },
  { name: "Artists", href: "/admin/artists", icon: UsersIcon },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  {
    name: "Content",
    icon: Image,
    children: [
      { name: "Banners", href: "/admin/content/banners" },
      { name: "Collections", href: "/admin/content/collections" },
    ],
  },
  { name: "Users", href: "/admin/users", icon: Grid3X3 },
  { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r">
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b">
            <h1 className="text-xl font-semibold">Miraki Admin</h1>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) =>
              item.children ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                      <ChevronDown className="h-4 w-4 ml-auto" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start" side="right">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.name} asChild>
                        <Link
                          to={child.href}
                          className="w-full cursor-pointer"
                        >
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent",
                    "transition-colors duration-200"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            )}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-4 mb-4">
              <Avatar>
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback>
                  {user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="flex-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
}
