import { useEffect, useState, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Components
import Navbar from "@/components/Navbar";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import AuthCallback from "@/components/AuthCallback";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Create axios instance with credentials
export const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Auth Context
export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Skip auth check if we're on the callback with session_id
    if (location.hash?.includes('session_id=')) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await apiClient.get("/auth/me");
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [location.hash]);

  const login = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/dashboard';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
      setUser(null);
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthProvider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthProvider>
  );
};

// Simple context provider
const AuthContextValue = { user: null, setUser: () => {}, loading: true, login: () => {}, logout: () => {} };
const AuthProviderContext = React.createContext(AuthContextValue);

const AuthProvider = ({ children, value }) => {
  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthProviderContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Router wrapper to detect session_id
const AppRouter = () => {
  const location = useLocation();
  
  // Check URL fragment for session_id synchronously during render
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

// Import React at top level
import React from "react";

function App() {
  return (
    <div className="min-h-screen bg-[#050505] grain relative overflow-x-hidden">
      <BrowserRouter>
        <AuthContext>
          <Navbar />
          <main className="relative z-10">
            <AnimatePresence mode="wait">
              <AppRouter />
            </AnimatePresence>
          </main>
        </AuthContext>
      </BrowserRouter>
      <Toaster 
        theme="dark" 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0a0a0f',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;
