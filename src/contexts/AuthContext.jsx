import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      console.log('Attempting to login with:', { email });
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);
      
      if (!response.ok) {
        console.error('Login failed:', data.message || 'Unknown error');
        throw new Error(data.message || 'Login failed');
      }

      if (!data.user) {
        console.error('User data not found in response');
        throw new Error('Authentication error: User data not received');
      }

      const userData = {
        email: data.user.email,
        name: data.user.name,
        isAdmin: data.user.isAdmin,
        token: data.token,
        redirectTo: data.user.isAdmin ? '/admin' : '/expense'
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      setUser(userData);
      
      console.log('Login successful, redirecting to:', userData.redirectTo);
      navigate(userData.redirectTo);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      console.log('Attempting to register user:', { email: userData.email, name: userData.name });
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('Registration response:', data);
      
      if (!response.ok) {
        console.error('Registration failed:', data.message || 'Unknown error');
        throw new Error(data.message || 'Registration failed');
      }

      const newUser = {
        email: data.user.email,
        name: data.user.name,
        isAdmin: data.user.isAdmin,
        token: data.token,
        redirectTo: '/expense'
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', data.token);
      setUser(newUser);
      
      console.log('Registration successful, redirecting to /expense');
      navigate('/expense');
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Signup failed:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(() => {
    console.log('Logging out user');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    console.log('User logged out, redirecting to login');
    window.location.href = '/login';
  }, []);

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
