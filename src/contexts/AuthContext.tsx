
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types/auth';
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Staff',
    email: 'staff@example.com',
    role: 'staff',
    photoURL: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    name: 'Jane CEO',
    email: 'ceo@example.com',
    role: 'ceo',
    photoURL: 'https://i.pravatar.cc/150?img=2'
  },
  {
    id: '3',
    name: 'Mark Accountant',
    email: 'accountant@example.com',
    role: 'accountant',
    photoURL: 'https://i.pravatar.cc/150?img=3'
  }
];

const MOCK_PASSWORDS: Record<string, string> = {
  'staff@example.com': 'password',
  'ceo@example.com': 'password',
  'accountant@example.com': 'password'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored user data', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // Validate email and password
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Find user by email
      const user = MOCK_USERS.find(user => user.email === email);
      
      if (!user || MOCK_PASSWORDS[email] !== password) {
        throw new Error("Invalid email or password");
      }
      
      // Set the user in state
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success("Login successful", {
        description: `Welcome back, ${user.name}!`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error("Login failed", {
        description: errorMessage
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    toast.info("You have been logged out");
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
