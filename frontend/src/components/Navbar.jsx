import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Scissors, LogOut, User, LayoutDashboard } from "lucide-react";

export const Navbar = () => {
  const { user, loading, login, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="navbar fixed top-0 left-0 right-0 z-50 px-6 py-4"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 group"
          data-testid="logo-link"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white font-outfit">
            Flip<span className="gradient-text">Cut</span>
          </span>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-32 h-9 rounded-full skeleton" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-white hover:bg-white/5"
                onClick={() => navigate('/dashboard')}
                data-testid="dashboard-nav-btn"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-colors"
                    data-testid="user-menu-trigger"
                  >
                    <Avatar className="w-8 h-8 border border-white/10">
                      <AvatarImage src={user.picture} alt={user.name} />
                      <AvatarFallback className="bg-[#7c3aed] text-white text-sm">
                        {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-[#0a0a0f] border-white/10"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className="text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    onClick={() => navigate('/dashboard')}
                    data-testid="dashboard-menu-item"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
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
              Sign in with Google
            </Button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
