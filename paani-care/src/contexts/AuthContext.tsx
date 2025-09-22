import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'asha_worker' | 'volunteer' | 'healthcare_worker' | 'district_health_official' | 'government_body' | 'community_user';
  avatar?: string;
  organization?: string;
  location?: string;
  phone?: string;
  permissions?: string[];
  district?: string;
  village?: string;
  specialization?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'asha_worker' | 'volunteer' | 'healthcare_worker' | 'district_health_official' | 'government_body' | 'community_user';
  organization?: string;
  location?: string;
  phone?: string;
  district?: string;
  village?: string;
  specialization?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem('paanicare-user');
        const storedToken = localStorage.getItem('paanicare-token');
        
        if (storedUser && storedToken) {
          // In a real app, verify the token with the backend
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('paanicare-user');
        localStorage.removeItem('paanicare-token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication logic with role-based assignments
      if (email && password.length >= 6) {
        let userRole: User['role'] = 'community_user';
        let userName = 'Community User';
        let permissions: string[] = ['view_reports', 'submit_reports'];

        // Role assignment based on email patterns
        if (email.includes('admin')) {
          userRole = 'admin';
          userName = 'System Administrator';
          permissions = ['all'];
        } else if (email.includes('asha')) {
          userRole = 'asha_worker';
          userName = 'ASHA Worker';
          permissions = ['view_reports', 'submit_reports', 'connect_doctors', 'village_updates'];
        } else if (email.includes('health')) {
          userRole = 'healthcare_worker';
          userName = 'Healthcare Worker';
          permissions = ['view_reports', 'submit_reports', 'diagnose', 'prescribe'];
        } else if (email.includes('district')) {
          userRole = 'district_health_official';
          userName = 'District Health Official';
          permissions = ['view_reports', 'submit_reports', 'manage_outbreaks', 'send_updates'];
        } else if (email.includes('govt')) {
          userRole = 'government_body';
          userName = 'Government Official';
          permissions = ['view_reports', 'policy_decisions', 'resource_allocation'];
        } else if (email.includes('volunteer')) {
          userRole = 'volunteer';
          userName = 'Community Volunteer';
          permissions = ['view_reports', 'submit_reports', 'community_outreach'];
        }

        const mockUser: User = {
          id: Date.now().toString(),
          email,
          name: userName,
          role: userRole,
          organization: 'Paani Care NER',
          location: 'Northeast India',
          phone: '+91-9876543210',
          permissions,
          district: 'Kamrup',
          village: 'Sample Village'
        };

        setUser(mockUser);
        localStorage.setItem('paanicare-user', JSON.stringify(mockUser));
        localStorage.setItem('paanicare-token', 'mock-jwt-token');
        
        message.success('Login successful!');
        return true;
      } else {
        message.error('Invalid credentials. Use any email and password with 6+ characters.');
        return false;
      }
    } catch (error) {
      message.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
        organization: userData.organization,
        location: userData.location,
        phone: userData.phone
      };

      setUser(newUser);
      localStorage.setItem('paanicare-user', JSON.stringify(newUser));
      localStorage.setItem('paanicare-token', 'mock-jwt-token');
      
      message.success('Registration successful! Welcome to Paani Care.');
      return true;
    } catch (error) {
      message.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('paanicare-user');
    localStorage.removeItem('paanicare-token');
    message.info('You have been logged out.');
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('paanicare-user', JSON.stringify(updatedUser));
      
      message.success('Profile updated successfully!');
      return true;
    } catch (error) {
      message.error('Profile update failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;