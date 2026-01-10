import React, { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "@/components/Navbar";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import AuthCallback from "@/components/AuthCallback";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const apiClient = axios.create({
  baseURL: API,
  withCredentials: true,
});

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
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
    <AuthProvider value={{ user, setUser, loading, login, logout, showThankYou, setShowThankYou }}>
      {children}
    </AuthProvider>
  );
};

const AuthContextValue = { user: null, setUser: () => {}, loading: true, login: () => {}, logout: () => {}, showThankYou: false, setShowThankYou: () => {} };
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

const NavbarWrapper = () => {
  const { setShowThankYou } = useAuth();
  return <Navbar onOpenThankYou={() => setShowThankYou(true)} />;
};

const AppRouter = () => {
  const location = useLocation();
  
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

function App() {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <BrowserRouter>
        <AuthContext>
          <NavbarWrapper />
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
            background: '#18181b',
            border: '1px solid #27272a',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;
