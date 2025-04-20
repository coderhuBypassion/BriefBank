import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/clerk";
import { Search, Bell, Menu, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenAuthModal?: () => void;
}

export default function Header({ onOpenAuthModal }: HeaderProps) {
  const [location, navigate] = useLocation();
  const { isSignedIn, user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.email) return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            {isSignedIn && (
              <button
                type="button"
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-5 w-5" />
              </button>
            )}

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="text-primary font-bold text-xl cursor-pointer flex items-center">
                  <span className="mr-1.5 text-primary">
                    <Sparkles className="h-5 w-5 inline" />
                  </span>
                  BriefBank
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            {isSignedIn && (
              <div className="hidden md:ml-8 md:flex md:space-x-6">
                <Link href="/dashboard">
                  <div className={`${
                    location === "/dashboard" 
                      ? "border-primary border-b-2 text-gray-900" 
                      : "border-transparent border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 text-sm font-medium transition-all duration-150 cursor-pointer`}>
                    Dashboard
                  </div>
                </Link>
                <Link href="/decks">
                  <div className={`${
                    location.startsWith("/deck") && location !== "/dashboard"
                      ? "border-primary border-b-2 text-gray-900" 
                      : "border-transparent border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 text-sm font-medium transition-all duration-150 cursor-pointer`}>
                    Pitch Decks
                  </div>
                </Link>
                <Link href="/saved">
                  <div className={`${
                    location === "/saved" 
                      ? "border-primary border-b-2 text-gray-900" 
                      : "border-transparent border-b-2 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    } inline-flex items-center px-1 pt-1 text-sm font-medium transition-all duration-150 cursor-pointer`}>
                    Saved
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Right side menu */}
          <div className="flex items-center">
            {isSignedIn ? (
              <>
                {/* Search */}
                <div className="flex-1 flex items-center justify-center lg:ml-6 lg:justify-end">
                  <div className="max-w-lg w-full lg:max-w-xs">
                    <label htmlFor="search" className="sr-only">Search</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <Input
                        id="search"
                        name="search"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="Search decks..."
                        type="search"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification bell */}
                <button className="ml-4 p-1.5 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200 focus:outline-none">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-5 w-5" />
                </button>

                {/* Profile dropdown */}
                <div className="ml-4 relative flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="p-0.5 rounded-full hover:bg-gray-100">
                        <Avatar className="h-8 w-8 ring-2 ring-gray-200">
                          <AvatarImage src="" alt={user?.email || "User"} />
                          <AvatarFallback className="bg-primary text-white font-medium">{getInitials()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-1 rounded-xl overflow-hidden shadow-lg">
                      <div className="px-4 py-3 bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                        {user?.isPro && (
                          <p className="text-xs text-gray-500 mt-1">Pro Member</p>
                        )}
                      </div>
                      <DropdownMenuItem className="cursor-pointer">
                        Your Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  className="text-gray-700 hover:text-primary font-medium" 
                  onClick={onOpenAuthModal}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white rounded-lg px-6 shadow-sm" 
                  onClick={onOpenAuthModal}
                >
                  Sign Up Free
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isSignedIn && (
        <div className={`md:hidden ${mobileMenuOpen ? "block" : "hidden"} shadow-lg border-t`}>
          <div className="pt-2 pb-3 space-y-1 bg-white">
            <Link href="/dashboard">
              <div className={`${
                location === "/dashboard" 
                  ? "bg-gray-50 border-primary border-l-4 text-primary" 
                  : "border-transparent border-l-4 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                } block pl-3 pr-4 py-2 text-base font-medium cursor-pointer`}>
                Dashboard
              </div>
            </Link>
            <Link href="/decks">
              <div className={`${
                location.startsWith("/deck") 
                  ? "bg-gray-50 border-primary border-l-4 text-primary" 
                  : "border-transparent border-l-4 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                } block pl-3 pr-4 py-2 text-base font-medium cursor-pointer`}>
                Pitch Decks
              </div>
            </Link>
            <Link href="/saved">
              <div className={`${
                location === "/saved" 
                  ? "bg-gray-50 border-primary border-l-4 text-primary" 
                  : "border-transparent border-l-4 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                } block pl-3 pr-4 py-2 text-base font-medium cursor-pointer`}>
                Saved
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
