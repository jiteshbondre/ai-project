import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GraduationCap, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  // Don't show navigation on login page
  if (location.pathname === "/login" || location.pathname === "/") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/login");
  };

  const menuItems = [
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "AI Teacher", path: "/student/ai-teacher" },
    { label: "Homework", path: "/student/homework" },
    { label: "Games", path: "/student/games" },
    { label: "Progress", path: "/student/progress" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover-scale"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-ai-purple rounded-xl shadow-[var(--shadow-soft)]">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:inline">AI School</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "default" : "ghost"}
                onClick={() => navigate(item.path)}
                className="rounded-lg"
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Logout Button - Desktop */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex rounded-full"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start rounded-lg"
                >
                  {item.label}
                </Button>
              ))}
              <Button
                variant="ghost"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start rounded-lg gap-2 text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
