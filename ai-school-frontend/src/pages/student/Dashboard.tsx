import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Brain, 
  Video, 
  Gamepad2, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar
} from "lucide-react";

interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  status: "complete" | "pending" | "due-today";
  progress?: number;
  dueDate?: string;
}

const StudentDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [homeworkItems] = useState<HomeworkItem[]>([
    {
      id: "1",
      subject: "Mathematics",
      title: "Fractions & Decimals",
      status: "pending",
      progress: 75,
      dueDate: "Due Today"
    },
    {
      id: "2",
      subject: "History",
      title: "Mughal Empire",
      status: "complete"
    },
    {
      id: "3",
      subject: "Mathematics",
      title: "Maths Worksheet",
      status: "due-today",
      dueDate: "Due Today"
    },
    {
      id: "4",
      subject: "Science",
      title: "Plant Cell Structure",
      status: "pending",
      dueDate: "Due Fri"
    },
    {
      id: "5",
      subject: "English",
      title: "Essay Writing",
      status: "complete"
    }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge className="status-complete">Complete</Badge>;
      case "pending":
        return <Badge className="status-pending">In Progress</Badge>;
      case "due-today":
        return <Badge className="status-due-today">Due Today</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "due-today":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-ai-purple/5">
      {/* Header */}
      <header className="bg-card border-b border-border p-6 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="animate-fade-in">
              <h1 className="text-3xl sm:text-4xl font-bold mb-1">{user.name}</h1>
              <p className="text-muted-foreground text-base sm:text-lg">Standard: {user.standard}</p>
            </div>
            <div className="text-left sm:text-right animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <p className="text-xl sm:text-2xl font-semibold">{user.school}</p>
              <p className="text-sm text-muted-foreground">Student Portal</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-8">
        {/* Welcome Section */}
        <div className="mb-8 sm:mb-10 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Welcome to your Personalized Dashboard
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Track your homework status, learn through AI, and explore new topics!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Dashboard Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Homework Status */}
            <Card className="border hover:border-primary/30 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  Your Homework Status
                </CardTitle>
                <CardDescription className="text-base">
                  Track your assignments and submission progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {homeworkItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="group flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-border rounded-lg hover:border-primary/50 hover:shadow-[var(--shadow-soft)] transition-all duration-200"
                      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                    >
                      <div className="flex items-center gap-3 mb-3 sm:mb-0">
                        {getStatusIcon(item.status)}
                        <div>
                          <h4 className="font-semibold text-base group-hover:text-primary transition-colors">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {item.progress && (
                          <div className="flex items-center gap-2">
                            <Progress value={item.progress} className="w-24 h-2" />
                            <span className="text-sm font-semibold">{item.progress}%</span>
                          </div>
                        )}
                        {item.dueDate && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">{item.dueDate}</span>
                        )}
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link to="/student/homework">
                    <Button variant="default" size="lg" className="w-full">
                      View All Homework & Assignments
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              <Link to="/student/homework" className="group">
                <Card className="border hover:border-primary/50 transition-all duration-200 hover:shadow-[var(--shadow-medium)]">
                  <CardContent className="p-5 sm:p-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-lg mb-3 group-hover:bg-primary/15 transition-all duration-200">
                      <BookOpen className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-1">Homework</h3>
                    <p className="text-xs text-muted-foreground">Submit & Track</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/student/ai-teacher" className="group">
                <Card className="border hover:border-primary/50 transition-all duration-200 hover:shadow-[var(--shadow-medium)]">
                  <CardContent className="p-5 sm:p-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-lg mb-3 group-hover:bg-primary/15 transition-all duration-200">
                      <Brain className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-1">AI Teacher</h3>
                    <p className="text-xs text-muted-foreground">Ask Questions</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/student/video-learning" className="group">
                <Card className="border hover:border-primary/50 transition-all duration-200 hover:shadow-[var(--shadow-medium)]">
                  <CardContent className="p-5 sm:p-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-success/10 rounded-lg mb-3 group-hover:bg-success/15 transition-all duration-200">
                      <Video className="h-7 w-7 sm:h-8 sm:w-8 text-success" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-1">Videos</h3>
                    <p className="text-xs text-muted-foreground">AI Generated</p>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/student/games" className="group">
                <Card className="border hover:border-primary/50 transition-all duration-200 hover:shadow-[var(--shadow-medium)]">
                  <CardContent className="p-5 sm:p-6 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-warning/10 rounded-lg mb-3 group-hover:bg-warning/15 transition-all duration-200">
                      <Gamepad2 className="h-7 w-7 sm:h-8 sm:w-8 text-warning" />
                    </div>
                    <h3 className="font-bold text-base sm:text-lg mb-1">Games</h3>
                    <p className="text-xs text-muted-foreground">Learn & Play</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Topics */}
            <Card className="border hover:border-primary/30 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  Recent Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="group p-4 bg-muted rounded-lg border hover:border-primary/30 transition-all duration-200 cursor-pointer">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">Photosynthesis</h4>
                    <p className="text-xs text-muted-foreground">Science</p>
                  </div>
                  <div className="group p-4 bg-muted rounded-lg border hover:border-primary/30 transition-all duration-200 cursor-pointer">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">Algebra Basics</h4>
                    <p className="text-xs text-muted-foreground">Mathematics</p>
                  </div>
                  <div className="group p-4 bg-muted rounded-lg border hover:border-primary/30 transition-all duration-200 cursor-pointer">
                    <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">French Revolution</h4>
                    <p className="text-xs text-muted-foreground">History</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card className="border hover:border-primary/30 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  Today's Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <span className="text-sm font-medium">Math Practice</span>
                    <Badge className="status-pending">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <span className="text-sm font-medium">Science Quiz</span>
                    <Badge className="status-due-today bg-red-100 text-red-600 border-red-200">Due Soon</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                    <span className="text-sm font-medium">Reading</span>
                    <Badge className="status-complete">Done</Badge>
                  </div>
                </div>
                <div className="mt-6">
                  <Link to="/student/progress">
                    <Button variant="outline" size="lg" className="w-full">
                      View Full Progress
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;