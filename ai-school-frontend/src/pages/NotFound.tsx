import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 to-ai-purple/5 p-4">
      <div className="text-center max-w-md w-full">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-ai-purple rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="mb-4 text-6xl sm:text-8xl font-bold text-gradient">404</h1>
        <p className="mb-6 text-lg sm:text-xl text-muted-foreground">Oops! Page not found</p>
        <p className="mb-8 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <Button asChild className="btn-primary">
          <a href="/">
            <GraduationCap className="h-4 w-4 mr-2" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
