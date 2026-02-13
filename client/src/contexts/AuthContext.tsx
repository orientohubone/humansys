import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  session: any;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  clearInvalidSession: () => Promise<void>;
  loading: boolean;
  isLoading: boolean;
  updateUserAvatar: (avatarUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage if available, but verify with server
    const initializeAuth = async () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          // Validate that the user has a proper UUID format
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          
          if (parsedUser.id && uuidRegex.test(parsedUser.id)) {
            // Verify user exists in database
            try {
              const response = await fetch(`/api/users/${parsedUser.id}`);
              if (response.ok) {
                const result = await response.json();
                if (result.success && result.data) {
                  console.log('✅ User verified in database');
                  setUser(parsedUser);
                  setSession({ user: parsedUser, access_token: 'mock-token' });
                } else {
                  console.log('🔄 User not found in database, clearing localStorage');
                  localStorage.removeItem('user');
                }
              } else {
                console.log('🔄 User verification failed, clearing localStorage');
                localStorage.removeItem('user');
              }
            } catch (verifyError) {
              console.log('🔄 User verification error, clearing localStorage');
              localStorage.removeItem('user');
            }
          } else {
            console.log('🔄 Invalid user ID format detected, clearing localStorage');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.log('🔄 Error parsing user data, clearing localStorage');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: any }> => {
    try {
      console.log('🔐 Attempting login for:', email);

      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log('❌ Login failed:', data.error);
        return { success: false, error: data.error || 'Invalid login credentials' };
      }

      console.log('✅ Login successful:', data.user);

      // Use the role from the database response
      let userData = data.user;

      // Load profile data to get the avatar
      try {
        const profileResponse = await fetch(`/api/users/${userData.id}`);

        if (profileResponse.ok) {
          const result = await profileResponse.json();
          if (result.success && result.data.avatar_url) {
            userData = {
              ...userData,
              avatar_url: result.data.avatar_url,
              full_name: result.data.full_name || userData.full_name
            };
            console.log('✅ Avatar and profile loaded from database');
          }
        }
      } catch (error) {
        console.warn('⚠️ Could not load profile avatar:', error);
      }

      setUser(userData);
      setSession({ user: userData, access_token: data.access_token || 'mock-token' });

      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error('❌ Network error during login:', error);
      return { success: false, error: 'Network error. Please check your connection.' };
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, full_name: name }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Sign up failed' };
      }

      const userData = data.user;
      setUser(userData);
      setSession({ user: userData, access_token: 'mock-token' });

      localStorage.setItem('user', JSON.stringify(userData));

      return { error: null };
    } catch (error) {
      return { error: 'Network error' };
    }
  };

  const signOut = async () => {
    console.log('🚪 Starting signOut process...');
    
    // Clear all user data
    setUser(null);
    setSession(null);
    
    // Clear all storage
    localStorage.removeItem('user');
    localStorage.clear();
    sessionStorage.clear();
    
    console.log('✅ SignOut completed - all data cleared');
  };

  const clearInvalidSession = async (): Promise<void> => {
    console.log('🧹 Clearing invalid session data');
    localStorage.removeItem('user');
    sessionStorage.clear();
    setUser(null);
    setSession(null);
    
    // Call cleanup endpoint to verify database state
    try {
      const response = await fetch('/api/auth/cleanup', { method: 'POST' });
      const result = await response.json();
      if (result.success) {
        console.log('✅ Server session cleanup completed');
        console.log('Valid users in database:', result.validUsers);
      }
    } catch (error) {
      console.warn('⚠️ Could not contact cleanup endpoint:', error);
    }
  };

  // Force logout if user has invalid ID format
  useEffect(() => {
    if (user && user.id && !user.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      console.log('🔄 Invalid user ID detected, forcing logout');
      signOut();
    }
  }, [user]);

  const updateUserAvatar = (avatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar_url: avatarUrl };
      setUser(updatedUser);

      // Update session as well
      setSession((prevSession: any) => ({
        ...prevSession,
        user: updatedUser
      }));

      // Persist to localStorage
      try {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('✅ User avatar updated in context, session and localStorage');
      } catch (error) {
        console.error('❌ Error persisting user avatar:', error);
      }
    }
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    clearInvalidSession,
    loading,
    isLoading: loading,
    updateUserAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};