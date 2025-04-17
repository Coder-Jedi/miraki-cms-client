
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Define user roles and permissions
export type UserRole = "admin" | "staff" | "artist" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
}

// Mock users for testing different roles
const MOCK_USERS = {
  admin: {
    id: "admin-id",
    name: "Admin User",
    email: "admin@miraki-art.com",
    role: "admin" as UserRole,
    permissions: ["manage_users", "manage_artworks", "manage_artists", "manage_orders", "manage_settings", "manage_content"]
  },
  staff: {
    id: "staff-id",
    name: "Staff User",
    email: "staff@miraki-art.com",
    role: "staff" as UserRole,
    permissions: ["manage_artworks", "manage_artists", "manage_orders"]
  },
  artist: {
    id: "artist-id",
    name: "Artist User",
    email: "artist@miraki-art.com",
    role: "artist" as UserRole,
    permissions: ["manage_own_artworks"]
  },
  viewer: {
    id: "viewer-id",
    name: "Viewer User",
    email: "viewer@miraki-art.com",
    role: "viewer" as UserRole,
    permissions: []
  }
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("miraki-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("miraki-user");
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email
    const lowerEmail = email.toLowerCase();
    let matchedUser = null;
    
    if (lowerEmail === "admin@miraki-art.com" && password === "admin123") {
      matchedUser = MOCK_USERS.admin;
    } else if (lowerEmail === "staff@miraki-art.com" && password === "staff123") {
      matchedUser = MOCK_USERS.staff;
    } else if (lowerEmail === "artist@miraki-art.com" && password === "artist123") {
      matchedUser = MOCK_USERS.artist;
    } else if (lowerEmail === "viewer@miraki-art.com" && password === "viewer123") {
      matchedUser = MOCK_USERS.viewer;
    }
    
    if (matchedUser) {
      setUser(matchedUser);
      localStorage.setItem("miraki-user", JSON.stringify(matchedUser));
      toast({
        title: "Login successful",
        description: `Welcome back, ${matchedUser.name}!`,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      throw new Error("Invalid credentials");
    }
    
    setIsLoading(false);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("miraki-user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.role === "admin") return true; // Admin has all permissions
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
