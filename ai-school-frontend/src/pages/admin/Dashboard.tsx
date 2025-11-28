import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Settings, 
  BarChart3,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Bell,
  Shield,
  Database,
  Activity,
  Send,
  MessageSquare,
  AlertCircle,
  Info
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastType, setBroadcastType] = useState("INFO");
  const [toStudents, setToStudents] = useState(true);
  const [toTeachers, setToTeachers] = useState(true);
  const [recentBroadcasts, setRecentBroadcasts] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Mock data
  const schoolStats = {
    totalStudents: 1247,
    totalTeachers: 89,
    totalClasses: 45,
    activeUsers: 856
  };

  const students = [
    { id: 1, name: "Alice Johnson", class: "10A", status: "Active", lastLogin: "2 hours ago" },
    { id: 2, name: "Bob Smith", class: "9B", status: "Active", lastLogin: "1 day ago" },
    { id: 3, name: "Carol Davis", class: "11C", status: "Inactive", lastLogin: "1 week ago" },
  ];

  const teachers = [
    { id: 1, name: "Dr. Sarah Wilson", subject: "Mathematics", status: "Active", students: 45 },
    { id: 2, name: "Mr. John Brown", subject: "Physics", status: "Active", students: 38 },
    { id: 3, name: "Ms. Emma Taylor", subject: "English", status: "On Leave", students: 42 },
  ];

  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message to broadcast",
        variant: "destructive",
      });
      return;
    }

    if (!toStudents && !toTeachers) {
      toast({
        title: "Error",
        description: "Please select at least one recipient type (Students or Teachers)",
        variant: "destructive",
      });
      return;
    }

    if (!user || !user.schoolId) {
      toast({
        title: "Error",
        description: "School information not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch("http://localhost:8080/api/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          schoolId: user.schoolId,
          message: broadcastMessage.trim(),
          type: broadcastType,
          toStudents: toStudents,
          toTeachers: toTeachers,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const notificationCount = await response.json();

      // Add to recent broadcasts
      const newBroadcast = {
        id: Date.now().toString(),
        message: broadcastMessage.trim(),
        type: broadcastType,
        toStudents,
        toTeachers,
        count: notificationCount,
        timestamp: new Date().toLocaleString(),
      };
      setRecentBroadcasts([newBroadcast, ...recentBroadcasts].slice(0, 10)); // Keep last 10

      toast({
        title: "Broadcast Sent Successfully!",
        description: `Message sent to ${notificationCount} ${notificationCount === 1 ? 'recipient' : 'recipients'}.`,
      });

      // Reset form
      setBroadcastMessage("");
      setBroadcastType("INFO");
    } catch (error) {
      console.error("Error sending broadcast:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send broadcast. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage your entire school system</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Notifications</span>
                <span className="sm:hidden">Alerts</span>
              </Button>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Settings</span>
                <span className="sm:hidden">Config</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardDescription>Total Students</CardDescription>
                  <Users className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{schoolStats.totalStudents}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardDescription>Total Teachers</CardDescription>
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{schoolStats.totalTeachers}</div>
                  <p className="text-xs text-muted-foreground">+3 new this month</p>
                </CardContent>
              </Card>

              <Card className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardDescription>Active Classes</CardDescription>
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{schoolStats.totalClasses}</div>
                  <p className="text-xs text-muted-foreground">Across all grades</p>
                </CardContent>
              </Card>

              <Card className="gradient-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardDescription>Active Users</CardDescription>
                  <Activity className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{schoolStats.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">68% engagement rate</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New student registration</p>
                      <p className="text-sm text-muted-foreground">Alice Johnson joined Grade 10A</p>
                    </div>
                    <Badge variant="secondary">2h ago</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Teacher added</p>
                      <p className="text-sm text-muted-foreground">Dr. Sarah Wilson - Mathematics</p>
                    </div>
                    <Badge variant="secondary">5h ago</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">System backup completed</p>
                      <p className="text-sm text-muted-foreground">Daily backup successful</p>
                    </div>
                    <Badge variant="secondary">1d ago</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add New Student
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Add New Teacher
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export Reports
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Backup Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Students Management Tab */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Student Management</h2>
                <p className="text-muted-foreground">Manage all student accounts and data</p>
              </div>
              <div className="flex gap-2">
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Student
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Import
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Students</CardTitle>
                  <Input placeholder="Search students..." className="w-64" />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>
                          <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{student.lastLogin}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Broadcast Tab */}
          <TabsContent value="broadcast" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Message Broadcast</h2>
              <p className="text-muted-foreground">Send announcements and notifications to students and teachers</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Broadcast Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-primary" />
                      Send Broadcast Message
                    </CardTitle>
                    <CardDescription>
                      Send important announcements to students and/or teachers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="message-type">Message Type</Label>
                      <Select value={broadcastType} onValueChange={setBroadcastType}>
                        <SelectTrigger id="message-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INFO">
                            <div className="flex items-center gap-2">
                              <Info className="h-4 w-4 text-blue-500" />
                              Information
                            </div>
                          </SelectItem>
                          <SelectItem value="ALERT">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                              Alert
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="broadcast-message">Message *</Label>
                      <Textarea
                        id="broadcast-message"
                        value={broadcastMessage}
                        onChange={(e) => setBroadcastMessage(e.target.value)}
                        placeholder="Enter your broadcast message here..."
                        className="min-h-[150px]"
                        disabled={isSending}
                      />
                      <p className="text-xs text-muted-foreground">
                        {broadcastMessage.length} characters
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Label>Recipients *</Label>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="to-students"
                            checked={toStudents}
                            onCheckedChange={(checked) => setToStudents(checked === true)}
                            disabled={isSending}
                          />
                          <Label
                            htmlFor="to-students"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                          >
                            <Users className="h-4 w-4" />
                            Send to Students
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="to-teachers"
                            checked={toTeachers}
                            onCheckedChange={(checked) => setToTeachers(checked === true)}
                            disabled={isSending}
                          />
                          <Label
                            htmlFor="to-teachers"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                          >
                            <GraduationCap className="h-4 w-4" />
                            Send to Teachers
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleSendBroadcast}
                      disabled={isSending || !broadcastMessage.trim() || (!toStudents && !toTeachers)}
                      className="w-full"
                      size="lg"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isSending ? "Sending..." : "Send Broadcast"}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Broadcasts */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Bell className="h-4 w-4" />
                      Recent Broadcasts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentBroadcasts.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No broadcasts sent yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {recentBroadcasts.map((broadcast) => (
                          <div
                            key={broadcast.id}
                            className="p-3 border rounded-lg space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <Badge
                                variant={broadcast.type === "ALERT" ? "destructive" : "default"}
                                className="text-xs"
                              >
                                {broadcast.type === "ALERT" ? (
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <Info className="h-3 w-3 mr-1" />
                                )}
                                {broadcast.type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {broadcast.timestamp}
                              </span>
                            </div>
                            <p className="text-sm font-medium line-clamp-2">
                              {broadcast.message}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {broadcast.toStudents && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  Students
                                </span>
                              )}
                              {broadcast.toTeachers && (
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="h-3 w-3" />
                                  Teachers
                                </span>
                              )}
                              <span className="ml-auto">
                                {broadcast.count} sent
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Teachers Management Tab */}
          <TabsContent value="teachers" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Teacher Management</h2>
                <p className="text-muted-foreground">Manage all teacher accounts and assignments</p>
              </div>
              <Button>
                <GraduationCap className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">{teacher.name}</TableCell>
                        <TableCell>{teacher.subject}</TableCell>
                        <TableCell>
                          <Badge variant={teacher.status === 'Active' ? 'default' : 'secondary'}>
                            {teacher.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{teacher.students}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Content Management</h2>
                <p className="text-muted-foreground">Manage curriculum, assignments, and learning materials</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Curriculum</CardTitle>
                  <CardDescription>Manage subjects and syllabus</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">Edit Mathematics</Button>
                  <Button variant="outline" className="w-full justify-start">Edit Science</Button>
                  <Button variant="outline" className="w-full justify-start">Edit English</Button>
                  <Button variant="outline" className="w-full justify-start">Add New Subject</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Content</CardTitle>
                  <CardDescription>Manage AI-generated materials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">Review AI Videos</Button>
                  <Button variant="outline" className="w-full justify-start">AI Question Bank</Button>
                  <Button variant="outline" className="w-full justify-start">Content Quality Check</Button>
                  <Button variant="outline" className="w-full justify-start">AI Settings</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assignments</CardTitle>
                  <CardDescription>Manage homework and tests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">Pending Reviews</Button>
                  <Button variant="outline" className="w-full justify-start">Assignment Templates</Button>
                  <Button variant="outline" className="w-full justify-start">Grade Settings</Button>
                  <Button variant="outline" className="w-full justify-start">Bulk Actions</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">School Analytics</h2>
              <p className="text-muted-foreground">Comprehensive insights and reports</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">87%</div>
                  <p className="text-sm text-muted-foreground">Average Grade</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">92%</div>
                  <p className="text-sm text-muted-foreground">Daily Active Users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">78%</div>
                  <p className="text-sm text-muted-foreground">Assignment Rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">156</div>
                  <p className="text-sm text-muted-foreground">Daily AI Interactions</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Management Tab */}
          <TabsContent value="system" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">System Management</h2>
              <p className="text-muted-foreground">System settings, security, and maintenance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    User Permissions
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Access Logs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Password Policies
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Maintenance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Database Backup
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    System Performance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Configuration
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;