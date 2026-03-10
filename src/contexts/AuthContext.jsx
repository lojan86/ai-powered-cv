import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USERS = [
  {
    id: 'user-1',
    email: 'candidate@demo.com',
    password: 'demo123',
    name: 'Alex Johnson',
    role: 'candidate',
    avatar: null,
    createdAt: '2025-10-15T10:00:00Z',
  },
  {
    id: 'user-2',
    email: 'recruiter@demo.com',
    password: 'demo123',
    name: 'Sarah Chen',
    role: 'recruiter',
    company: 'TechCorp Inc.',
    avatar: null,
    createdAt: '2025-09-20T10:00:00Z',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('cv_auth_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('cv_auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('cv_users') || '[]');
    const allUsers = [...DEMO_USERS, ...users];
    const found = allUsers.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem('cv_auth_user', JSON.stringify(safeUser));
      return { success: true, user: safeUser };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('cv_users') || '[]');
    const allUsers = [...DEMO_USERS, ...users];
    if (allUsers.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('cv_users', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem('cv_auth_user', JSON.stringify(safeUser));
    return { success: true, user: safeUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cv_auth_user');
  };

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('cv_auth_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
