import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaperCheckFeature } from "@/components/teacher/PaperCheckFeature";
import { ClassResultsManager } from "@/components/teacher/ClassResultsManager";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  BookOpen,
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  Brain,
  GraduationCap,
  Star,
  FileCheck,
  BarChart3,
  Loader2
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  subject: string;
  progress: number;
  status: "excellent" | "good" | "needs-attention" | "low-progress";
  lastActivity: string;
  assignment?: string;
}

interface PaperResult {
  id: string;
  studentName: string;
  assignmentName: string;
  score: number;
  grade: string;
  feedback: string;
  detailedFeedback: {
    strengths: string[];
    improvements: string[];
    suggestions: string[];
  };
  submissionDate: string;
  checkedDate: string;
  aiAnalysis: {
    accuracy: number;
    completeness: number;
    clarity: number;
    creativity: number;
  };
}

const TeacherDashboard = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [paperResults, setPaperResults] = useState<PaperResult[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [classStats, setClassStats] = useState({
    averageScore: 0,
    currentModule: "N/A",
    masteryLevel: 0,
    totalStudents: 0,
    activeAssignments: 0
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  const badges = [
    { name: "Math Master", students: 8, icon: "trophy" },
    { name: "Science Explorer", students: 12, icon: "microscope" },
    { name: "Avid Reader", students: 6, icon: "book" }
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Try to fetch class data if we have userId and className
      // Note: className might not be in user object, teachers may teach multiple classes
      if (parsedUser.userId && parsedUser.className) {
        fetchClassData(parsedUser.userId, parsedUser.className, parsedUser.subjectId);
      }
    }
    
    // Load saved paper results from localStorage
    const savedResults = localStorage.getItem("teacher_paper_results");
    if (savedResults) {
      setPaperResults(JSON.parse(savedResults));
    }
  }, []);

  const fetchClassData = async (teacherId: number, className: string, subjectId?: number) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      // Fetch class students
      const studentsResponse = await fetch(`http://localhost:8080/api/teacher/classes/${encodeURIComponent(className)}/students`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (studentsResponse.ok) {
        const classStudents = await studentsResponse.json();
        
        // Fetch progress for each student
        const studentProgressPromises = classStudents.map(async (student: any) => {
          try {
            const progressResponse = await fetch(`http://localhost:8080/api/students/${student.id}/progress`, {
              headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
              },
            });
            
            if (progressResponse.ok) {
              const progressData = await progressResponse.json();
              return { student, progress: progressData };
            }
            return { student, progress: null };
          } catch (error) {
            console.error(`Error fetching progress for student ${student.id}:`, error);
            return { student, progress: null };
          }
        });

        const studentsWithProgress = await Promise.all(studentProgressPromises);
        
        // Transform to Student format
        const transformedStudents: Student[] = studentsWithProgress.map(({ student, progress }) => {
          // Calculate progress from assignments and assessments
          let calculatedProgress = 0;
          let status: "excellent" | "good" | "needs-attention" | "low-progress" = "good";
          let lastAssignment = "";
          
          if (progress && progress.subjects && progress.subjects.length > 0) {
            // Find subject progress if subjectId is available
            const subjectProgress = subjectId 
              ? progress.subjects.find((s: any) => s.subjectId === subjectId)
              : progress.subjects[0];
            
            if (subjectProgress) {
              const assignmentProgress = subjectProgress.totalAssignments > 0
                ? Math.round((subjectProgress.submittedAssignments / subjectProgress.totalAssignments) * 100)
                : 0;
              
              const avgMarks = subjectProgress.averageMarks ? parseFloat(subjectProgress.averageMarks.toString()) : 0;
              const marksProgress = avgMarks > 0 ? Math.min(Math.round((avgMarks / 100) * 100), 100) : 0;
              
              calculatedProgress = Math.round((assignmentProgress * 0.6) + (marksProgress * 0.4));
              
              if (calculatedProgress >= 80) {
                status = "excellent";
              } else if (calculatedProgress >= 60) {
                status = "good";
              } else if (calculatedProgress >= 40) {
                status = "needs-attention";
              } else {
                status = "low-progress";
              }
              
              lastAssignment = subjectProgress.videoTitles && subjectProgress.videoTitles.length > 0
                ? subjectProgress.videoTitles[0]
                : `${subjectProgress.pendingAssignments || 0} pending assignments`;
            }
          }
          
          return {
            id: student.id?.toString() || Date.now().toString(),
            name: student.fullName || "Unknown",
            subject: subjectId ? (progress?.subjects?.find((s: any) => s.subjectId === subjectId)?.subjectName || "General") : "General",
            progress: calculatedProgress,
            status: status,
            lastActivity: "Recently",
            assignment: lastAssignment,
          };
        });

        setStudents(transformedStudents);

        // Calculate class statistics
        if (transformedStudents.length > 0) {
          const totalProgress = transformedStudents.reduce((sum, s) => sum + s.progress, 0);
          const averageProgress = Math.round(totalProgress / transformedStudents.length);
          
          // Get current module from first student's subject or use default
          const currentModule = transformedStudents[0]?.subject || "N/A";
          
          // Calculate mastery level (average of excellent students)
          const excellentStudents = transformedStudents.filter(s => s.status === "excellent");
          const masteryLevel = excellentStudents.length;

          setClassStats({
            averageScore: averageProgress,
            currentModule: currentModule,
            masteryLevel: masteryLevel,
            totalStudents: transformedStudents.length,
            activeAssignments: assignments.length,
          });
        }
      }

      // Fetch assignments if subjectId is available
      if (subjectId && teacherId) {
        const assignmentsResponse = await fetch(`http://localhost:8080/api/teacher/${teacherId}/subjects/${subjectId}/assignments`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (assignmentsResponse.ok) {
          const assignmentsData = await assignmentsResponse.json();
          setAssignments(assignmentsData);
          setClassStats(prev => ({ ...prev, activeAssignments: assignmentsData.length }));
        }

        // Fetch performance data
        const performanceResponse = await fetch(`http://localhost:8080/api/teacher/subjects/${subjectId}/performance`, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (performanceResponse.ok) {
          const performanceData = await performanceResponse.json();
          setPerformanceData(performanceData);
          
          // Update average score from performance data
          if (performanceData.length > 0) {
            const totalMarks = performanceData.reduce((sum: number, p: any) => {
              const marks = p.marksObtained ? parseFloat(p.marksObtained.toString()) : 0;
              return sum + marks;
            }, 0);
            const avgMarks = Math.round(totalMarks / performanceData.length);
            setClassStats(prev => ({ ...prev, averageScore: avgMarks }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching class data:", error);
      toast({
        title: "Error",
        description: "Failed to load class data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultSaved = (result: PaperResult) => {
    const updatedResults = [...paperResults, result];
    setPaperResults(updatedResults);
    localStorage.setItem("teacher_paper_results", JSON.stringify(updatedResults));
  };

  const handleDeleteResult = (id: string) => {
    const updatedResults = paperResults.filter(result => result.id !== id);
    setPaperResults(updatedResults);
    localStorage.setItem("teacher_paper_results", JSON.stringify(updatedResults));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-success";
      case "good":
        return "text-primary";
      case "needs-attention":
        return "text-warning";
      case "low-progress":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="status-complete" variant="default">Excellent</Badge>;
      case "good":
        return <Badge className="status-pending" variant="secondary">Good</Badge>;
      case "needs-attention":
        return <Badge className="status-due-today" variant="outline">Needs Attention</Badge>;
      case "low-progress":
        return <Badge className="bg-red-100 text-red-600 border-red-200" variant="destructive">Low Progress</Badge>;
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-4">
              <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Teacher Panel</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-base sm:text-lg font-semibold">{user.school || user.schoolName || "School"}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {user.className ? `Class Overview - ${user.className}` : "Teacher Dashboard"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="papers" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Paper Check</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
            {/* Class Overview Stats */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading class data...</span>
              </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Scores</p>
                      <p className="text-3xl font-bold text-primary">{classStats.averageScore}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Current Module Mastery</p>
                      <p className="text-3xl font-bold text-success">{classStats.masteryLevel}</p>
                    </div>
                    <Brain className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                      <p className="text-3xl font-bold text-ai-purple">{classStats.totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-ai-purple" />
                  </div>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Current Focus & Alerts */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Current Focus & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-primary">{classStats.currentModule}</h4>
                    <div className="space-y-2">
                      {assignments.length > 0 && (
                        <div className="p-3 bg-accent rounded-lg">
                          <p className="font-medium text-sm">{assignments[0]?.subjectName || "ASSIGNMENTS"}</p>
                          <p className="text-xs text-muted-foreground">
                            {assignments.filter((a: any) => !a.submitted).length} pending assignments
                          </p>
                        </div>
                      )}
                      <div className="p-3 bg-accent rounded-lg">
                        <p className="font-medium text-sm">Next Goal:</p>
                        <p className="text-xs">Improve class average to 80%</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-3 text-warning">Alerts & Recommendations</h4>
                    <div className="space-y-2">
                      {students.filter(s => s.status === "low-progress" || s.status === "needs-attention").slice(0, 2).map((student) => (
                        <div key={student.id} className="p-3 bg-warning-light border border-warning/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            <p className="font-medium text-sm">Low Progress</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {student.name} - {student.progress}%
                          </p>
                        </div>
                      ))}
                      {assignments.filter((a: any) => a.dueDate && new Date(a.dueDate) <= new Date(Date.now() + 86400000)).length > 0 && (
                        <div className="p-3 bg-success-light border border-success/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-success" />
                            <p className="font-medium text-sm">Assignment Due</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {assignments.filter((a: any) => a.dueDate && new Date(a.dueDate) <= new Date(Date.now() + 86400000)).length} assignment(s) due soon
                          </p>
                        </div>
                      )}
                      {students.length === 0 && (
                        <div className="p-3 bg-primary-light border border-primary/20 rounded-lg">
                          <p className="text-xs text-muted-foreground">No alerts at this time</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-primary-light border border-primary/20 rounded-lg">
                  <p className="text-sm font-medium text-primary mb-2">Class Suggestion:</p>
                  <p className="text-sm">
                    {students.filter(s => s.status === "low-progress").length > 0
                      ? `Focus on supporting ${students.filter(s => s.status === "low-progress").length} student(s) with low progress`
                      : "Great job! Continue maintaining high engagement and performance"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Student Tracker */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Student Tracker
                </CardTitle>
                <CardDescription>
                  Monitor individual student progress and identify those needing support
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading students...</span>
                  </div>
                ) : students.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No students found in this class</p>
                  </div>
                ) : (
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-ai-purple/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">{student.subject}</p>
                          <p className="text-xs text-muted-foreground">{student.lastActivity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Progress value={student.progress} className="w-20" />
                            <span className={`text-sm font-semibold ${getStatusColor(student.status)}`}>
                              {student.progress}%
                            </span>
                          </div>
                          {student.assignment && (
                            <p className="text-xs text-muted-foreground">{student.assignment}</p>
                          )}
                        </div>
                        {getStatusBadge(student.status)}
                      </div>
                    </div>
                  ))}
                </div>
                )}

                <div className="mt-6 flex justify-between items-center">
                  <select 
                    className="px-3 py-2 border border-border rounded-md bg-background"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    disabled={students.length === 0}
                  >
                    <option value="">Select Student...</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                  <Button 
                    className="btn-primary"
                    disabled={!selectedStudent}
                    onClick={() => {
                      // Navigate to student detail page or show modal
                      toast({
                        title: "Student Details",
                        description: `Viewing details for ${students.find(s => s.id === selectedStudent)?.name}`,
                      });
                    }}
                  >
                    View Detailed Report
                  </Button>
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
                  <Button variant="ghost" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Courses
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Trophy className="h-4 w-4 mr-2" />
                    Assignments
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Goals & Badges */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-warning" />
                  Goals & Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {badges.map((badge, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg border hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          {badge.icon === "trophy" && <Trophy className="h-4 w-4 text-primary" />}
                          {badge.icon === "microscope" && <Brain className="h-4 w-4 text-success" />}
                          {badge.icon === "book" && <BookOpen className="h-4 w-4 text-warning" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{badge.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {badge.students} students earned
                          </p>
                        </div>
                      </div>
                      <Badge className="status-complete" variant="default">
                        <Star className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    Create New Badge
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button className="btn-primary w-full">
                    Create Assignment
                  </Button>
                  <Button className="btn-success w-full">
                    Grade Submissions
                  </Button>
                  <Button variant="outline" className="w-full">
                    Send Announcement
                  </Button>
                </div>
              </CardContent>
            </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="papers">
            <PaperCheckFeature 
              onResultSaved={handleResultSaved}
              classResults={paperResults}
            />
          </TabsContent>

          <TabsContent value="results">
            <ClassResultsManager 
              results={paperResults}
              onDeleteResult={handleDeleteResult}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;