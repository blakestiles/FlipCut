import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiClient, useAuth } from "@/App";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {

    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {

        const hash = location.hash;
        const sessionIdMatch = hash.match(/session_id=([^&]+)/);
        
        if (!sessionIdMatch) {
          toast.error("Authentication failed: No session ID");
          navigate("/");
          return;
        }

        const sessionId = sessionIdMatch[1];

        const response = await apiClient.post("/auth/session", {
          session_id: sessionId
        });

        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          toast.success(`Welcome, ${response.data.user.name}!`);
          navigate("/dashboard", { replace: true, state: { user: response.data.user } });
        } else {
          throw new Error("Authentication failed");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        
        let errorMessage = "Authentication failed. Please try again.";
        
        if (error.response) {
          errorMessage = error.response.data?.detail || error.response.statusText || errorMessage;
        } else if (error.request) {
          errorMessage = "Network error: Could not reach the server. Please check your connection and backend URL configuration.";
          console.error("Network error - no response received. Backend URL:", process.env.REACT_APP_BACKEND_URL);
        } else {
          errorMessage = error.message || errorMessage;
        }
        
        toast.error(errorMessage);
        navigate("/");
      }
    };

    processAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 className="w-10 h-10 text-[#7c3aed] animate-spin" />
        <p className="text-zinc-400 text-sm">Signing you in...</p>
      </motion.div>
    </div>
  );
};

export default AuthCallback;
