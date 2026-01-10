import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/App";
import { LogOut, LayoutDashboard } from "lucide-react";

export const Navbar = ({ onOpenThankYou }) => {
  const { user, loading, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-black/80 backdrop-blur-md border-b border-zinc-900"
      data-testid="navbar"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {isLanding && onOpenThankYou ? (
          <button
            onClick={onOpenThankYou}
            className="group relative overflow-hidden rounded-full px-5 py-2.5 bg-zinc-900 border border-zinc-700 hover:border-zinc-500 transition-all duration-300"
            data-testid="thank-uplane-btn"
          >
            
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.2)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </span>
            <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-b from-zinc-700/50 to-transparent" />
            <span className="relative text-sm text-zinc-300 group-hover:text-white transition-colors">My message to Uplane Team</span>
          </button>
        ) : (
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            data-testid="logo-link"
          >
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M4 4L10 12L4 20H8L14 12L8 4H4Z" fill="black"/>
                <path d="M12 4L18 12L12 20H16L22 12L16 4H12Z" fill="black" fillOpacity="0.5"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">FlipCut</span>
          </Link>
        )}

        {isLanding && (
          <Link 
            to="/" 
            className="flex items-center gap-3 group absolute left-1/2 -translate-x-1/2"
            data-testid="logo-link-center"
          >
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                <path d="M4 4L10 12L4 20H8L14 12L8 4H4Z" fill="black"/>
                <path d="M12 4L18 12L12 20H16L22 12L16 4H12Z" fill="black" fillOpacity="0.5"/>
              </svg>
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">FlipCut</span>
          </Link>
        )}

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-24 h-9 rounded-full bg-zinc-900 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-white hover:bg-zinc-900"
                onClick={() => navigate('/dashboard')}
                data-testid="dashboard-nav-btn"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-900 transition-colors"
                    data-testid="user-menu-trigger"
                  >
                    <Avatar className="w-8 h-8 border border-zinc-800">
                      <AvatarImage src={user.picture} alt={user.name} />
                      <AvatarFallback className="bg-white text-black text-sm font-medium">
                        {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-zinc-900 border-zinc-800"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem 
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                    onClick={() => navigate('/dashboard')}
                    data-testid="dashboard-menu-item"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem 
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                    onClick={logout}
                    data-testid="logout-menu-item"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button
              onClick={login}
              className="rounded-full bg-white text-black hover:bg-zinc-200 px-6 font-medium"
              data-testid="login-btn"
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
