import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Calendar,
  GraduationCap,
  Brain,
  Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AITeacherAssistant from "@/components/student/AITeacherAssistant";

interface Assignment {
  id: string;
  subject: string;
  subjectId?: number;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  score?: string;
  submittedAt?: string;
}

const Homework = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false);
  const [assignmentFeedback, setAssignmentFeedback] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissionNotes, setSubmissionNotes] = useState<string>("");

  const [aiGeneratedAssignments] = useState([
    { id: "ai1", subject: "Science", title: "Cell Biology Quiz", type: "Quiz" },
    { id: "ai2", subject: "History", title: "French Revolution Essay", type: "Essay" },
    { id: "ai3", subject: "Mathematics", title: "Fraction Problems", type: "Worksheet" }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.userId) {
        fetchAssignments(parsedUser.userId);
      }
    }
  }, []);

  const fetchAssignments = async (studentId: number) => {
    setIsLoadingAssignments(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/students/${studentId}/assignments`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (response.ok) {
        const assignmentData = await response.json();
        // Transform API response to Assignment format
        const transformedAssignments: Assignment[] = assignmentData.map((assignment: any) => {
          let formattedDueDate = "No due date";
          if (assignment.dueDate) {
            try {
              // Handle both date string and LocalDate format
              const date = new Date(assignment.dueDate);
              if (!isNaN(date.getTime())) {
                formattedDueDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
              }
            } catch (e) {
              formattedDueDate = assignment.dueDate;
            }
          }
          
          return {
            id: assignment.assignmentId?.toString() || Date.now().toString(),
            subject: assignment.subjectName || "General",
            subjectId: assignment.subjectId || undefined,
            title: assignment.title || "Untitled Assignment",
            description: `Assignment for ${assignment.subjectName}`,
            dueDate: formattedDueDate,
            status: assignment.submitted ? "submitted" : "pending" as const,
            submittedAt: assignment.submitted 
              ? new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
              : undefined,
          };
        });
        setAssignments(transformedAssignments);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast({
        title: "Error",
        description: "Failed to load assignments. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAssignments(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, assignmentId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image (JPG, PNG, GIF) or PDF file.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
          variant: "destructive",
        });
        return;
      }
      
      // If selecting a different assignment, clear previous notes
      if (selectedAssignmentId !== assignmentId) {
        setSubmissionNotes("");
      }
      
      setSelectedFile(file);
      setSelectedAssignmentId(assignmentId);
      setAssignmentFeedback(null);
    }
  };

  const handleSubmitHomework = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!user || !user.userId) {
      toast({
        title: "Error",
        description: "Please log in to submit assignments",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      
      // Get the selected assignment to extract subjectId
      const selectedAssignment = assignments.find(a => a.id === selectedAssignmentId);
      
      // Get current student ID from user object (automatically fetched from localStorage)
      const currentStudentId = user?.userId;
      
      if (!currentStudentId) {
        toast({
          title: "Error",
          description: "Student ID not found. Please log in again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      // Add assignment details as JSON string
      const details = {
        assignmentId: selectedAssignmentId ? parseInt(selectedAssignmentId) : null,
        studentId: currentStudentId, // Automatically fetched from current user
        subjectId: selectedAssignment?.subjectId || null, // Include subject ID from assignment
        notes: submissionNotes || ""
      };
      formData.append("details", JSON.stringify(details));

      const response = await fetch("/api/ai/assignments/submit", {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type header, browser will set it with boundary
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.feedback) {
        setAssignmentFeedback(data.feedback);
        toast({
          title: "Assignment Submitted Successfully!",
          description: "Your assignment has been submitted and AI feedback is available.",
        });
        
        // Update assignment status
        if (selectedAssignmentId) {
          setAssignments(prev => prev.map(assignment => 
            assignment.id === selectedAssignmentId
              ? { ...assignment, status: "submitted" as const, submittedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }
              : assignment
          ));
        }
        
        setSelectedFile(null);
        setSelectedAssignmentId(null);
        setSubmissionNotes("");
      } else {
        throw new Error("No feedback received from server");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit assignment. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="h-4 w-4 text-warning" />;
      case "graded":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="status-pending">Submitted - Awaiting Review</Badge>;
      case "graded":
        return <Badge className="status-complete">Graded</Badge>;
      default:
        return <Badge className="status-due-today">Submit Required</Badge>;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-ai-purple text-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-4">
              <Link to="/student/dashboard" className="hover:text-primary-light">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
                <p className="text-primary-light text-sm sm:text-base">Homework & Assignments</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-base sm:text-lg font-semibold">{user.school}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/*
          Responsive tab fixes applied:
          - TabsList becomes horizontally scrollable on small screens (flex + overflow-x-auto)
          - TabsList is sticky with a backdrop and z-index to avoid content overlapping triggers
          - Each TabsContent now has top margin (mt-4) to ensure it doesn't sit under the TabsList
          - Triggers use whitespace-nowrap so labels don't wrap and cause height jumps
        */}

        <Tabs defaultValue="current" className="w-full relative">
          <TabsList className="flex w-full gap-2 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 md:grid-cols-4 sticky top-20 z-30 bg-background/80 backdrop-blur-md rounded-md px-1 sm:px-0">
            <TabsTrigger value="current" className="text-xs sm:text-sm whitespace-nowrap">Current Homework</TabsTrigger>
            <TabsTrigger value="ai-assistant" className="text-xs sm:text-sm whitespace-nowrap">AI Assistant</TabsTrigger>
            <TabsTrigger value="status" className="text-xs sm:text-sm whitespace-nowrap">Submission Status</TabsTrigger>
            <TabsTrigger value="ai-generated" className="text-xs sm:text-sm whitespace-nowrap">AI Generated</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6 mt-4 sm:mt-0">
            <div className="grid gap-6">
              <Card className="card-elevated animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Current Homework & Submissions
                  </CardTitle>
                  <CardDescription>
                    Upload your completed assignments and track submission progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAssignments ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading assignments...</p>
                    </div>
                  ) : assignments.filter(a => a.status === "pending").length === 0 ? (
                    <div className="text-center py-8 bg-accent/50 rounded-lg">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No pending assignments. Great job!</p>
                    </div>
                  ) : (
                  <div className="space-y-4">
                    {assignments.filter(a => a.status === "pending").map((assignment) => (
                      <div key={assignment.id} className="border border-border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{assignment.title}</h3>
                            <p className="text-muted-foreground">{assignment.subject}</p>
                            <p className="text-sm mt-2">{assignment.description}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-red-600">
                                Due: {assignment.dueDate}
                              </span>
                            </div>
                            {getStatusBadge(assignment.status)}
                          </div>
                        </div>

                        {/* File Upload Section */}
                        <div className="bg-accent/50 rounded-lg p-4 mt-4">
                          <h4 className="font-medium mb-3">Submit Your Work</h4>
                          <div className="space-y-4">
                            <div className="space-y-3">
                              <label 
                                htmlFor={`file-upload-${assignment.id}`}
                                className="block cursor-pointer"
                              >
                                <input
                                  id={`file-upload-${assignment.id}`}
                                  type="file"
                                  onChange={(e) => handleFileUpload(e, assignment.id)}
                                  className="hidden"
                                  accept="image/*,.pdf"
                                  disabled={isSubmitting}
                                />
                                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-accent hover:border-primary transition-all duration-200">
                                  <Upload className="h-8 w-8 mx-auto mb-3 text-primary" />
                                  <p className="text-sm font-medium text-foreground mb-1">
                                    {selectedFile && selectedAssignmentId === assignment.id 
                                      ? `Selected: ${selectedFile.name}` 
                                      : "Click here or use button below to upload file"}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Supports: Images (JPG, PNG, GIF) or PDF • Max size: 10MB
                                  </p>
                                </div>
                              </label>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  const fileInput = document.getElementById(`file-upload-${assignment.id}`) as HTMLInputElement;
                                  if (fileInput) {
                                    fileInput.click();
                                  }
                                }}
                                disabled={isSubmitting}
                                className="w-full"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                {selectedFile && selectedAssignmentId === assignment.id 
                                  ? "Change File" 
                                  : "Choose File"}
                              </Button>
                            </div>
                            
                            {/* Submission Notes */}
                            <div className="space-y-2">
                              <label htmlFor={`notes-${assignment.id}`} className="text-sm font-medium">
                                Additional Notes (Optional)
                              </label>
                              <Textarea
                                id={`notes-${assignment.id}`}
                                placeholder="Add any additional notes or comments about your submission..."
                                value={selectedAssignmentId === assignment.id ? submissionNotes : ""}
                                onChange={(e) => setSubmissionNotes(e.target.value)}
                                disabled={isSubmitting || selectedAssignmentId !== assignment.id}
                                className="min-h-[80px]"
                              />
                            </div>
                            
                            <Button
                              onClick={handleSubmitHomework}
                              disabled={!selectedFile || selectedAssignmentId !== assignment.id || isSubmitting}
                              className="btn-success w-full sm:w-auto"
                            >
                              {isSubmitting ? "Submitting..." : "Submit"}
                            </Button>
                          </div>
                          
                          {/* AI Feedback Display */}
                          {assignmentFeedback && selectedAssignmentId === assignment.id && (
                            <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                              <h5 className="font-semibold mb-2 flex items-center gap-2">
                                <Brain className="h-4 w-4 text-primary" />
                                AI Feedback
                              </h5>
                              <p className="text-sm text-foreground whitespace-pre-wrap">{assignmentFeedback}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-assistant" className="space-y-6 mt-4 sm:mt-0">
            <AITeacherAssistant />
          </TabsContent>

          <TabsContent value="status" className="space-y-6 mt-4 sm:mt-0">
            <Card className="card-elevated animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Your Homework Status
                </CardTitle>
                <CardDescription>
                  Track the status of all your submitted assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAssignments ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading assignments...</p>
                  </div>
                ) : assignments.length === 0 ? (
                  <div className="text-center py-8 bg-accent/50 rounded-lg">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No assignments found.</p>
                  </div>
                ) : (
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(assignment.status)}
                        <div>
                          <h4 className="font-medium">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                          {assignment.submittedAt && (
                            <p className="text-xs text-muted-foreground">
                              Submitted: {assignment.submittedAt}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {assignment.score && (
                          <div className="text-right">
                            <p className="font-semibold text-success">Score: {assignment.score}</p>
                          </div>
                        )}
                        {getStatusBadge(assignment.status)}
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-generated" className="space-y-6 mt-4 sm:mt-0">
            <Card className="card-ai animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-ai-purple" />
                  AI Teacher Homework Generation
                </CardTitle>
                <CardDescription>
                  Generate personalized assignments using AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex gap-4 flex-col sm:flex-row">
                    <Input
                      placeholder="Enter topic or subject for homework generation..."
                      className="flex-1"
                    />
                    <Button className="btn-ai w-full sm:w-auto">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Homework
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Past AI-Generated Assignments
                  </h4>
                  <div className="space-y-3">
                    {aiGeneratedAssignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-4 bg-white/50 border border-ai-purple/20 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Brain className="h-4 w-4 text-ai-purple" />
                          <div>
                            <h5 className="font-medium">{assignment.title}</h5>
                            <p className="text-sm text-muted-foreground">
                              {assignment.subject} - {assignment.type}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Homework;
