import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Bell, 
  User, 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  Bus, 
  Brain,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  GraduationCap,
  Star,
  Award,
  Target,
  BarChart3,
  FileText,
  Download,
  Send
} from "lucide-react";

interface Child {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  photo?: string;
  overallProgress: number;
  nextAssignment?: {
    subject: string;
    title: string;
    dueDate: string;
  };
}

interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  maxScore?: number;
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
}

interface SubjectProgress {
  subject: string;
  progress: number;
  grade: string;
  trend: 'up' | 'down' | 'stable';
}

const ParentDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // Mock data for parent and children
  const mockChildren: Child[] = [
    {
      id: "child1",
      name: "Arjun Sharma",
      class: "7",
      section: "A",
      rollNumber: "23001",
      photo: "",
      overallProgress: 85,
      nextAssignment: {
        subject: "Mathematics",
        title: "Algebra Practice Set",
        dueDate: "2024-01-25"
      }
    },
    {
      id: "child2", 
      name: "Priya Sharma",
      class: "5",
      section: "B",
      rollNumber: "21045",
      photo: "",
      overallProgress: 92,
      nextAssignment: {
        subject: "Science",
        title: "Plant Life Cycle",
        dueDate: "2024-01-26"
      }
    }
  ];

  const mockAssignments: Assignment[] = [
    {
      id: "1",
      subject: "Mathematics",
      title: "Algebra Practice Set",
      dueDate: "2024-01-25",
      status: "pending"
    },
    {
      id: "2",
      subject: "Science",
      title: "Chemical Reactions Lab Report",
      dueDate: "2024-01-23",
      status: "submitted"
    },
    {
      id: "3",
      subject: "English",
      title: "Essay on Environmental Conservation",
      dueDate: "2024-01-20",
      status: "graded",
      score: 87,
      maxScore: 100
    }
  ];

  const mockAttendance: AttendanceRecord[] = [
    { date: "2024-01-22", status: "present" },
    { date: "2024-01-21", status: "present" },
    { date: "2024-01-20", status: "late" },
    { date: "2024-01-19", status: "present" },
    { date: "2024-01-18", status: "absent" }
  ];

  const mockSubjectProgress: SubjectProgress[] = [
    { subject: "Mathematics", progress: 78, grade: "B+", trend: "up" },
    { subject: "Science", progress: 85, grade: "A-", trend: "up" },
    { subject: "English", progress: 90, grade: "A", trend: "stable" },
    { subject: "Social Studies", progress: 82, grade: "B+", trend: "down" },
    { subject: "Hindi", progress: 88, grade: "A-", trend: "up" }
  ];

  const mockNotifications = [
    {
      id: "1",
      type: "assignment",
      title: "Assignment Due Tomorrow",
      message: "Mathematics homework is due tomorrow",
      time: "2 hours ago",
      urgent: true
    },
    {
      id: "2", 
      type: "message",
      title: "Message from Teacher",
      message: "Ms. Priya wants to discuss Arjun's progress",
      time: "5 hours ago",
      urgent: false
    },
    {
      id: "3",
      type: "fee",
      title: "Fee Payment Reminder",
      message: "Monthly fee payment is due in 3 days",
      time: "1 day ago",
      urgent: false
    }
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setSelectedChildId(mockChildren[0]?.id || "");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const selectedChild = mockChildren.find(child => child.id === selectedChildId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-warning bg-warning-light">Pending</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="text-primary bg-primary-light">Submitted</Badge>;
      case 'graded':
        return <Badge variant="outline" className="text-success bg-success-light">Graded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'absent':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'late':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-destructive rotate-180" />;
      default:
        return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-ai-light/10">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <h1 className="text-xl sm:text-2xl font-bold text-gradient">Parent Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Child Selector */}
              <select 
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="flex-1 sm:flex-none px-3 py-2 border border-border rounded-lg bg-card text-card-foreground text-sm"
              >
                {mockChildren.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.name} - Class {child.class}
                  </option>
                ))}
              </select>
              
              {/* Notifications */}
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {mockNotifications.filter(n => n.urgent).length}
                </span>
              </Button>
              
              {/* Profile */}
              <Avatar>
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="progress" className="text-xs sm:text-sm">Progress</TabsTrigger>
            <TabsTrigger value="assignments" className="text-xs sm:text-sm">Tasks</TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs sm:text-sm">Attend</TabsTrigger>
            <TabsTrigger value="communication" className="text-xs sm:text-sm">Messages</TabsTrigger>
            <TabsTrigger value="fees" className="text-xs sm:text-sm">Fees</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Child Summary Card */}
            {selectedChild && (
              <Card className="card-elevated">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedChild.photo} />
                      <AvatarFallback className="text-lg">
                        {selectedChild.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{selectedChild.name}</CardTitle>
                      <CardDescription>
                        Class {selectedChild.class}-{selectedChild.section} | Roll No: {selectedChild.rollNumber}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Overall Progress</h4>
                      <Progress value={selectedChild.overallProgress} className="h-3" />
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedChild.overallProgress}% Complete
                      </p>
                    </div>
                    {selectedChild.nextAssignment && (
                      <div>
                        <h4 className="font-medium mb-2">Next Due Assignment</h4>
                        <div className="space-y-1">
                          <p className="font-medium text-sm">{selectedChild.nextAssignment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedChild.nextAssignment.subject} • Due: {selectedChild.nextAssignment.dueDate}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex-col space-y-2"
                    onClick={() => setActiveTab("progress")}
                  >
                    <BarChart3 className="h-8 w-8 text-primary" />
                    <span>View Progress</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex-col space-y-2"
                    onClick={() => setActiveTab("attendance")}
                  >
                    <Calendar className="h-8 w-8 text-success" />
                    <span>Attendance</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex-col space-y-2"
                    onClick={() => setActiveTab("communication")}
                  >
                    <MessageSquare className="h-8 w-8 text-ai-purple" />
                    <span>Message Teacher</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-4 flex-col space-y-2"
                    onClick={() => setActiveTab("fees")}
                  >
                    <CreditCard className="h-8 w-8 text-warning" />
                    <span>Pay Fees</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications Feed */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNotifications.map(notification => (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {notification.urgent && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Academic Progress - {selectedChild?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockSubjectProgress.map(subject => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{subject.subject}</h4>
                          {getTrendIcon(subject.trend)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{subject.grade}</Badge>
                          <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                        </div>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="card-ai">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-card/50 rounded-lg border border-primary/20">
                    <h4 className="font-medium text-primary mb-2">Strong Performance</h4>
                    <p className="text-sm">
                      {selectedChild?.name} is excelling in English and Science. Their consistent effort shows in improved grades.
                    </p>
                  </div>
                  <div className="p-4 bg-card/50 rounded-lg border border-warning/20">
                    <h4 className="font-medium text-warning mb-2">Areas for Improvement</h4>
                    <p className="text-sm">
                      Mathematics needs attention, particularly in Algebra concepts. Consider additional practice sessions.
                    </p>
                  </div>
                  <div className="p-4 bg-card/50 rounded-lg border border-success/20">
                    <h4 className="font-medium text-success mb-2">Recommendations</h4>
                    <p className="text-sm">
                      Encourage daily 15-minute math practice. Available AI tutoring sessions can help with problem areas.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Assignments - {selectedChild?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAssignments.map(assignment => (
                    <div key={assignment.id} className="p-4 border border-border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                        </div>
                        {getStatusBadge(assignment.status)}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Due: {assignment.dueDate}</span>
                        {assignment.score && (
                          <span className="font-medium">
                            Score: {assignment.score}/{assignment.maxScore}
                          </span>
                        )}
                      </div>
                      {assignment.status === 'pending' && (
                        <Button size="sm" variant="outline" className="mt-2">
                          <Send className="h-4 w-4 mr-2" />
                          Send Reminder
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Attendance Record - {selectedChild?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAttendance.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <span className="font-medium">{record.date}</span>
                      <div className="flex items-center gap-2">
                        {getAttendanceIcon(record.status)}
                        <span className="capitalize text-sm">{record.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Monthly Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-success">18</div>
                      <div className="text-sm text-muted-foreground">Present</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-warning">1</div>
                      <div className="text-sm text-muted-foreground">Late</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-destructive">1</div>
                      <div className="text-sm text-muted-foreground">Absent</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Communication Tab */}
          <TabsContent value="communication" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarFallback>MS</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">Ms. Priya Sharma</h4>
                        <p className="text-sm text-muted-foreground">Class Teacher</p>
                      </div>
                    </div>
                    <p className="text-sm mb-2">
                      Hello! I wanted to discuss {selectedChild?.name}'s progress in Mathematics. 
                      Could we schedule a meeting this week?
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                      <Button size="sm">Reply</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-border rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar>
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">You</h4>
                        <p className="text-sm text-muted-foreground">Parent</p>
                      </div>
                    </div>
                    <p className="text-sm mb-2">
                      Thank you for reaching out. I'm available this Thursday after 4 PM. 
                      Please let me know what time works best for you.
                    </p>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </div>

                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start New Conversation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fees Tab */}
          <TabsContent value="fees" className="space-y-6">
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Fee Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Outstanding Fees */}
                  <div className="p-4 border border-warning/50 bg-warning-light rounded-lg">
                    <h4 className="font-medium text-warning mb-2">Outstanding Payment</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm">January 2024 Monthly Fee</p>
                        <p className="text-xs text-muted-foreground">Due: January 31, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-warning">₹5,500</p>
                        <Button size="sm" className="mt-2">Pay Now</Button>
                      </div>
                    </div>
                  </div>

                  {/* Payment History */}
                  <div>
                    <h4 className="font-medium mb-4">Payment History</h4>
                    <div className="space-y-3">
                      {[
                        { month: "December 2023", amount: "₹5,500", status: "Paid", date: "Dec 15, 2023" },
                        { month: "November 2023", amount: "₹5,500", status: "Paid", date: "Nov 10, 2023" },
                        { month: "October 2023", amount: "₹5,500", status: "Paid", date: "Oct 12, 2023" }
                      ].map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{payment.month}</p>
                            <p className="text-xs text-muted-foreground">{payment.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{payment.amount}</p>
                            <Badge variant="outline" className="text-success bg-success-light">
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Payment Receipt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParentDashboard;