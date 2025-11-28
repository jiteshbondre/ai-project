import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/Dashboard";
import Homework from "./pages/student/Homework";
import AITeacher from "./pages/student/AITeacher";
import VideoLearning from "./pages/student/VideoLearning";
import Games from "./pages/student/Games";
import Progress from "./pages/student/Progress";
import TeacherDashboard from "./pages/teacher/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import ParentDashboard from "./pages/parent/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="ai-school-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Student Routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/homework" element={<Homework />} />
            <Route path="/student/ai-teacher" element={<AITeacher />} />
            <Route path="/student/video-learning" element={<VideoLearning />} />
            <Route path="/student/games" element={<Games />} />
            <Route path="/student/progress" element={<Progress />} />
            
            {/* Teacher Routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            
            {/* Parent Routes */}
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
