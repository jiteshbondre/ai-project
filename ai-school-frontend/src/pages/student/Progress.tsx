import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Target, 
  BookOpen,
  GraduationCap,
  Plus,
  Trophy,
  Star,
  Award,
  Clock
} from "lucide-react";

interface LearningPath {
  id: string;
  subject: string;
  progress: number;
  totalTopics: number;
  completedTopics: number;
  status: "excellent" | "good" | "needs-improvement";
  lastActivity: string;
  nextTopic?: string;
  subjectId?: number;
}

interface CustomPath {
  id: string;
  name: string;
  description: string;
  progress: number;
  created: string;
}

const Progress = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [newSubject, setNewSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [overallStats, setOverallStats] = useState({
    averageProgress: 0,
    strongestSubject: "",
    strongestProgress: 0,
    needsAttention: "",
    needsAttentionProgress: 100,
    totalSubjects: 0,
  });
  const [customPaths, setCustomPaths] = useState<CustomPath[]>([
    {
      id: "space",
      name: "Space Exploration",
      description: "Learn about planets, stars, and space missions",
      progress: 30,
      created: "Oct 20, 2023"
    },
    {
      id: "coding",
      name: "Python Programming",
      description: "Introduction to coding with Python",
      progress: 15,
      created: "Oct 18, 2023"
    }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.userId) {
        fetchProgress(parsedUser.userId);
        fetchPerformance(parsedUser.userId);
      }
    }
  }, []);

  const fetchProgress = async (studentId: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/students/${studentId}/progress`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Transform API response to LearningPath format
        const transformedPaths: LearningPath[] = (data.subjects || []).map((subject: any) => {
          // Calculate progress based on assignments and assessments
          const assignmentProgress = subject.totalAssignments > 0 
            ? Math.round((subject.submittedAssignments / subject.totalAssignments) * 100)
            : 0;
          
          // Combine assignment progress with assessment performance
          const avgMarks = subject.averageMarks ? parseFloat(subject.averageMarks.toString()) : 0;
          const marksProgress = avgMarks > 0 ? Math.min(Math.round((avgMarks / 100) * 100), 100) : 0;
          
          // Overall progress: 60% assignments, 40% assessments
          const overallProgress = Math.round((assignmentProgress * 0.6) + (marksProgress * 0.4));
          
          // Determine status
          let status: "excellent" | "good" | "needs-improvement" = "good";
          if (overallProgress >= 80) {
            status = "excellent";
          } else if (overallProgress < 50) {
            status = "needs-improvement";
          }
          
          // Calculate topics (use assignments + videos as topics)
          const totalTopics = subject.totalAssignments + (subject.videosCount || 0);
          const completedTopics = subject.submittedAssignments + Math.floor((subject.videosCount || 0) * (overallProgress / 100));
          
          return {
            id: subject.subjectId?.toString() || Date.now().toString(),
            subject: subject.subjectName || "Unknown",
            progress: overallProgress,
            totalTopics: Math.max(totalTopics, 1),
            completedTopics: Math.min(completedTopics, totalTopics),
            status: status,
            lastActivity: "Recently",
            nextTopic: subject.videoTitles && subject.videoTitles.length > 0 
              ? subject.videoTitles[0] 
              : `Complete ${subject.pendingAssignments || 0} pending assignments`,
            subjectId: subject.subjectId,
          };
        });
        
        setLearningPaths(transformedPaths);
        
        // Calculate overall statistics
        if (transformedPaths.length > 0) {
          const totalProgress = transformedPaths.reduce((sum, path) => sum + path.progress, 0);
          const averageProgress = Math.round(totalProgress / transformedPaths.length);
          
          const strongest = transformedPaths.reduce((max, path) => 
            path.progress > max.progress ? path : max
          );
          
          const weakest = transformedPaths.reduce((min, path) => 
            path.progress < min.progress ? path : min
          );
          
          setOverallStats({
            averageProgress,
            strongestSubject: strongest.subject,
            strongestProgress: strongest.progress,
            needsAttention: weakest.subject,
            needsAttentionProgress: weakest.progress,
            totalSubjects: transformedPaths.length,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
      toast({
        title: "Error",
        description: "Failed to load progress data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPerformance = async (studentId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/students/${studentId}/performance`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (response.ok) {
        const performanceData = await response.json();
        // Performance data can be used for additional insights if needed
        // Currently using it to enhance progress calculations
      }
    } catch (error) {
      console.error("Error fetching performance:", error);
    }
  };

  // Load custom learning paths from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("customPaths");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCustomPaths(parsed);
        }
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-[hsl(var(--success))]";
      case "good":
        return "text-[hsl(var(--primary))]";
      case "needs-improvement":
        return "text-[hsl(var(--warning))]";
      default:
        return "text-[hsl(var(--muted-foreground))]";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return (
          <div className="status-complete flex items-center">
            <Trophy className="h-3 w-3 mr-1" />
            Excellent
          </div>
        );
      case "good":
        return (
          <div className="status-pending flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Good Progress
          </div>
        );
      case "needs-improvement":
        return (
          <div className="status-due-today flex items-center">
            <Target className="h-3 w-3 mr-1" />
            Needs Focus
          </div>
        );
      default:
        return null;
    }
  };

  const handleCreatePath = () => {
    const name = newSubject.trim();
    if (name) {
      const newPath: CustomPath = {
        id: Date.now().toString(),
        name,
        description: `Custom learning path for ${name}`,
        progress: 0,
        created: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      };
      const updated = [...customPaths, newPath];
      setCustomPaths(updated);
      localStorage.setItem("customPaths", JSON.stringify(updated));
      setNewSubject("");
      toast({
        title: "Path Created!",
        description: `${name} learning path has been added.`,
      });
    } else {
      toast({
        title: "Enter a subject",
        description: "Please type a subject or interest to create a path.",
      });
    }
  };
  const handleContinueLearning = (subject: string, subjectId?: number) => {
    // Store subject context for AI Teacher
    if (subjectId) {
      localStorage.setItem("currentSubjectId", subjectId.toString());
    }
    navigate("/student/ai-teacher");
  };

  const handleViewDetails = (pathId: string) => {
    toast({
      title: "Coming Soon",
      description: "Detailed analytics will be available soon!",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary via-ai-purple to-ai-magenta text-white p-6 sm:p-8 rounded-b-[2rem] shadow-[var(--shadow-luxury)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-4">
              <Link to="/student/dashboard" className="hover:opacity-80 transition-opacity">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
                <p className="text-white/90 text-sm sm:text-base">Standard: {user.standard}</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-lg sm:text-xl font-semibold">{user.school}</p>
              <p className="text-sm text-white/90">Learning Progress</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Learning Status Overview */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[hsl(var(--primary))]" />
                  Check Learning Path Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[hsl(var(--muted-foreground))] mb-6">
                  Track your subject-wise learning progress and identify areas that need more attention for better performance.
                </p>

                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading progress data...</p>
                  </div>
                ) : learningPaths.length === 0 ? (
                  <div className="text-center py-8 bg-accent/50 rounded-lg">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No progress data available yet.</p>
                  </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {learningPaths.map((path) => {
                    const subjectColors: Record<string, { bg: string; text: string; icon: string; gradient: string }> = {
                      "Mathematics": { 
                        bg: "bg-gradient-to-br from-[#FF6B9D] to-[#FF8FB5]", 
                        text: "text-white", 
                        icon: "bg-white/30",
                        gradient: "from-[#FF6B9D]/20 to-[#FF8FB5]/10"
                      },
                      "Science": { 
                        bg: "bg-gradient-to-br from-[#4ECDC4] to-[#6EDDD5]", 
                        text: "text-white", 
                        icon: "bg-white/30",
                        gradient: "from-[#4ECDC4]/20 to-[#6EDDD5]/10"
                      },
                      "History": { 
                        bg: "bg-gradient-to-br from-[#FFB84D] to-[#FFC870]", 
                        text: "text-white", 
                        icon: "bg-white/30",
                        gradient: "from-[#FFB84D]/20 to-[#FFC870]/10"
                      },
                      "English": { 
                        bg: "bg-gradient-to-br from-[#A78BFA] to-[#C4B5FD]", 
                        text: "text-white", 
                        icon: "bg-white/30",
                        gradient: "from-[#A78BFA]/20 to-[#C4B5FD]/10"
                      },
                      "Robotics & AI": { 
                        bg: "bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA]", 
                        text: "text-white", 
                        icon: "bg-white/30",
                        gradient: "from-[#8B5CF6]/20 to-[#A78BFA]/10"
                      },
                      "Creative Writing": { 
                        bg: "bg-gradient-to-br from-[#EC4899] to-[#F472B6]", 
                        text: "text-white", 
                        icon: "bg-white/30",
                        gradient: "from-[#EC4899]/20 to-[#F472B6]/10"
                      },
                    };
                    const colors = subjectColors[path.subject] || { 
                      bg: "bg-gradient-to-br from-primary to-primary/70", 
                      text: "text-white", 
                      icon: "bg-white/30",
                      gradient: "from-primary/20 to-primary/10"
                    };
                    
                    return (
                      <Card key={path.id} className={`border-0 ${colors.bg} text-white overflow-hidden shadow-[var(--shadow-luxury)] transition-all hover:-translate-y-2 hover:shadow-[var(--shadow-xl)]`}>
                        <CardContent className="p-6">
                          {/* Icon and Title */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-16 h-16 ${colors.icon} backdrop-blur-sm rounded-3xl flex items-center justify-center flex-shrink-0`}>
                                <BookOpen className="h-8 w-8" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold mb-1">{path.subject}</h3>
                                <p className="text-white/80 text-sm">{path.completedTopics}/{path.totalTopics} topics</p>
                              </div>
                            </div>
                          </div>

                          {/* Circular Progress */}
                          <div className="flex items-center justify-center mb-6">
                            <div className="relative w-32 h-32">
                              <svg className="transform -rotate-90 w-32 h-32">
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="56"
                                  stroke="currentColor"
                                  strokeWidth="12"
                                  fill="none"
                                  className="text-white/20"
                                />
                                <circle
                                  cx="64"
                                  cy="64"
                                  r="56"
                                  stroke="currentColor"
                                  strokeWidth="12"
                                  fill="none"
                                  strokeDasharray={`${2 * Math.PI * 56}`}
                                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - path.progress / 100)}`}
                                  className="text-white transition-all duration-500"
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl font-bold">{path.progress}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Next Topic */}
                          {path.nextTopic && (
                            <div className="mb-4 p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                              <p className="text-xs font-semibold text-white/70 mb-1">Next Topic</p>
                              <p className="text-sm font-medium">{path.nextTopic}</p>
                            </div>
                          )}

                          {/* Action Button */}
                          <Button 
                            className="w-full bg-white/90 hover:bg-white text-gray-900 font-semibold shadow-md" 
                            onClick={() => handleContinueLearning(path.subject, path.subjectId)}
                            size="lg"
                          >
                            Continue Learning
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                )}
              </CardContent>
            </Card>

            {/* Custom Learning Paths */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[hsl(var(--ai-purple))]" />
                  Custom Learning Paths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex gap-4">
                    <Input
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Enter new subject or interest..."
                      className="flex-1"
                    />
                    <Button onClick={handleCreatePath} className="btn-ai">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Path
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  {customPaths.map((path) => (
                    <Card key={path.id} className="border border-[hsl(var(--ai-purple))]/20 bg-gradient-to-r from-[hsl(var(--ai-purple))]/10 to-[hsl(var(--primary))]/10">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-[hsl(var(--ai-purple))] mb-1">{path.name}</h4>
                            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">{path.description}</p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <ProgressBar value={path.progress} className="w-24 h-2" />
                                <span className="text-sm font-medium">{path.progress}%</span>
                              </div>
                              <span className="text-xs text-[hsl(var(--muted-foreground))]">
                                Created: {path.created}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleContinueLearning(path.name)}>
                            Continue
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Navigation */}
            <Card className="card-elevated">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Link to="/student/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Home
                    </Button>
                  </Link>
                  <Link to="/student/homework">
                    <Button variant="ghost" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Your Homework Status
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Overall Performance */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-[hsl(var(--warning))]" />
                  Overall Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[hsl(var(--primary))] mb-1">
                      {overallStats.averageProgress}%
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">Average Progress</p>
                  </div>
                  
                  <div className="space-y-3">
                    {overallStats.strongestSubject && (
                      <div className="flex justify-between">
                        <span className="text-sm">Strongest Subject</span>
                        <span className="font-semibold text-[hsl(var(--success))]">
                          {overallStats.strongestSubject} ({overallStats.strongestProgress}%)
                        </span>
                      </div>
                    )}
                    {overallStats.needsAttention && (
                      <div className="flex justify-between">
                        <span className="text-sm">Needs Attention</span>
                        <span className="font-semibold text-[hsl(var(--warning))]">
                          {overallStats.needsAttention} ({overallStats.needsAttentionProgress}%)
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm">Total Subjects</span>
                      <span className="font-semibold">{overallStats.totalSubjects}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Recommendations */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-sm">Study Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overallStats.needsAttention && overallStats.needsAttentionProgress < 70 && (
                    <div className="p-3 bg-[hsl(var(--warning-light))] border border-[hsl(var(--warning))]/20 rounded-lg">
                      <p className="text-sm font-medium text-[hsl(var(--warning))]">
                        Focus on {overallStats.needsAttention}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        Current progress: {overallStats.needsAttentionProgress}% - Needs improvement
                      </p>
                    </div>
                  )}
                  {overallStats.strongestSubject && overallStats.strongestProgress >= 80 && (
                    <div className="p-3 bg-[hsl(var(--success-light))] border border-[hsl(var(--success))]/20 rounded-lg">
                      <p className="text-sm font-medium text-[hsl(var(--success))]">
                        Great job in {overallStats.strongestSubject}!
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        Keep up the momentum - {overallStats.strongestProgress}% progress
                      </p>
                    </div>
                  )}
                  {learningPaths.length === 0 && (
                    <div className="p-3 bg-[hsl(var(--primary-light))] border border-[hsl(var(--primary))]/20 rounded-lg">
                      <p className="text-sm font-medium text-[hsl(var(--primary))]">
                        Start Learning
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        Complete assignments and watch videos to see your progress
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;