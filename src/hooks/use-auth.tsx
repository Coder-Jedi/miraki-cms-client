import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/services/auth.service";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const currentUser = authService.getCurrentUser();
        
        if (token && currentUser) {
          try {
            const isValid = await authService.validateToken();
            if (isValid) {
              setUser(currentUser);
            } else {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            }
          } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Admin has all permissions
    if (user.role === 'admin') return true;
    
    // Add role-based permissions
    const rolePermissions: Record<string, string[]> = {
      admin: ['manage_artworks', 'manage_artists', 'manage_collections', 'manage_orders', 'manage_users'],
      artist: ['manage_own_artworks', 'manage_own_profile'],
      user: []
    };

    return rolePermissions[user.role]?.includes(permission) ?? false;
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { user: loginUser, token } = await authService.login(email, password);
      
      if (!loginUser || !loginUser.name) {
        throw new Error('Invalid user data received');
      }

      setUser(loginUser);
      toast({
        title: "Login successful",
        description: `Welcome back, ${loginUser.name}!`,
      });
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        isAuthenticated: !!user,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
