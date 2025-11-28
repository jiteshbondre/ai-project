import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Download,
  Save,
  Loader2,
  Brain,
  Star,
  TrendingUp
} from "lucide-react";

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

interface PaperCheckFeatureProps {
  onResultSaved: (result: PaperResult) => void;
  classResults: PaperResult[];
}

export const PaperCheckFeature = ({ onResultSaved, classResults }: PaperCheckFeatureProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [currentResult, setCurrentResult] = useState<PaperResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [activeTab, setActiveTab] = useState("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const mockStudents = [
    "Arjun Sharma", "Sophia Martinez", "Raj Patel", "Emma Johnson", 
    "Liam Wilson", "Olivia Brown", "Noah Davis", "Ava Garcia"
  ];

  const mockAssignments = [
    "Cell Biology Quiz", "Photosynthesis Lab", "Algebra Worksheet", 
    "Essay Writing", "Physics Problem Set", "Chemistry Experiment"
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is ready for checking.`,
      });
    }
  };

  const simulateAICheck = async () => {
    setIsChecking(true);
    setActiveTab("results");
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate mock AI results
    const mockResult: PaperResult = {
      id: `result_${Date.now()}`,
      studentName: selectedStudent,
      assignmentName: selectedAssignment,
      score: Math.floor(Math.random() * 30) + 70, // 70-100 range
      grade: ["A+", "A", "B+", "B", "C+"][Math.floor(Math.random() * 5)],
      feedback: "Good understanding of the concepts with clear explanations. Some areas need improvement in detail and analysis.",
      detailedFeedback: {
        strengths: [
          "Clear understanding of basic concepts",
          "Well-structured answers",
          "Good use of examples"
        ],
        improvements: [
          "Add more detailed explanations",
          "Include relevant diagrams",
          "Improve conclusion quality"
        ],
        suggestions: [
          "Review chapter 5 for better understanding",
          "Practice more problem-solving exercises",
          "Focus on analytical thinking"
        ]
      },
      submissionDate: new Date().toISOString(),
      checkedDate: new Date().toISOString(),
      aiAnalysis: {
        accuracy: Math.floor(Math.random() * 20) + 80,
        completeness: Math.floor(Math.random() * 25) + 75,
        clarity: Math.floor(Math.random() * 20) + 80,
        creativity: Math.floor(Math.random() * 30) + 70
      }
    };
    
    setCurrentResult(mockResult);
    setIsChecking(false);
    
    toast({
      title: "Paper checked successfully!",
      description: `AI analysis complete for ${selectedStudent}'s ${selectedAssignment}`,
    });
  };

  const handleSaveResult = () => {
    if (currentResult) {
      onResultSaved(currentResult);
      toast({
        title: "Result saved",
        description: "Student result has been stored in class records.",
      });
      // Reset form
      setCurrentResult(null);
      setUploadedFile(null);
      setSelectedStudent("");
      setSelectedAssignment("");
      setActiveTab("upload");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-primary";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getGradeStyle = (grade: string) => {
    const gradeColors: { [key: string]: string } = {
      "A+": "bg-success text-success-foreground",
      "A": "bg-success/80 text-success-foreground",
      "B+": "bg-primary text-primary-foreground",
      "B": "bg-primary/80 text-primary-foreground",
      "C+": "bg-warning text-warning-foreground",
      "C": "bg-warning/80 text-warning-foreground"
    };
    return gradeColors[grade] || "bg-muted text-muted-foreground";
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Paper Check & Validation
        </CardTitle>
        <CardDescription>
          Upload student papers for instant AI analysis and grading
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Paper</TabsTrigger>
            <TabsTrigger value="results" disabled={!currentResult && !isChecking}>
              Results
            </TabsTrigger>
            <TabsTrigger value="history">Class Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Select Student</label>
                <select 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                >
                  <option value="">Choose student...</option>
                  {mockStudents.map((student) => (
                    <option key={student} value={student}>{student}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Select Assignment</label>
                <select 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  value={selectedAssignment}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                >
                  <option value="">Choose assignment...</option>
                  {mockAssignments.map((assignment) => (
                    <option key={assignment} value={assignment}>{assignment}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Upload Student Paper</p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF, DOC, DOCX, and image files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="hidden"
                />
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="mt-2"
                >
                  Choose File
                </Button>
              </div>
              
              {uploadedFile && (
                <div className="mt-4 p-3 bg-accent rounded-md">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{uploadedFile.name}</span>
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              onClick={simulateAICheck}
              disabled={!uploadedFile || !selectedStudent || !selectedAssignment || isChecking}
              className="w-full btn-primary"
            >
              {isChecking ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  AI Checking Paper...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Check Paper with AI
                </>
              )}
            </Button>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4 mt-4">
            {isChecking ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-lg font-semibold">AI is analyzing the paper...</p>
                <p className="text-sm text-muted-foreground">This may take a few moments</p>
              </div>
            ) : currentResult ? (
              <div className="space-y-6">
                {/* Score Summary */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className={`text-3xl font-bold ${getScoreColor(currentResult.score)}`}>
                          {currentResult.score}%
                        </div>
                        <p className="text-sm text-muted-foreground">Overall Score</p>
                      </div>
                      <div className="text-center">
                        <Badge className={`text-lg px-4 py-2 ${getGradeStyle(currentResult.grade)}`}>
                          {currentResult.grade}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-2">Grade</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-warning fill-current" />
                          <span className="text-2xl font-bold">
                            {(currentResult.score / 20).toFixed(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* AI Analysis Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Analysis Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Accuracy</span>
                          <span className="text-sm">{currentResult.aiAnalysis.accuracy}%</span>
                        </div>
                        <Progress value={currentResult.aiAnalysis.accuracy} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Completeness</span>
                          <span className="text-sm">{currentResult.aiAnalysis.completeness}%</span>
                        </div>
                        <Progress value={currentResult.aiAnalysis.completeness} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Clarity</span>
                          <span className="text-sm">{currentResult.aiAnalysis.clarity}%</span>
                        </div>
                        <Progress value={currentResult.aiAnalysis.clarity} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Creativity</span>
                          <span className="text-sm">{currentResult.aiAnalysis.creativity}%</span>
                        </div>
                        <Progress value={currentResult.aiAnalysis.creativity} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Detailed Feedback */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detailed Feedback</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-success mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {currentResult.detailedFeedback.strengths.map((strength, index) => (
                          <li key={index} className="text-sm pl-4 border-l-2 border-success">
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-warning mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {currentResult.detailedFeedback.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm pl-4 border-l-2 border-warning">
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Suggestions
                      </h4>
                      <ul className="space-y-1">
                        {currentResult.detailedFeedback.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm pl-4 border-l-2 border-primary">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex gap-2">
                  <Button onClick={handleSaveResult} className="btn-success flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Result
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold">No results to display</p>
                <p className="text-sm text-muted-foreground">
                  Upload and check a paper to see results here
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4 mt-4">
            {classResults.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Class Results ({classResults.length})</h3>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {classResults.map((result) => (
                    <Card key={result.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-ai-purple/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {result.studentName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{result.studentName}</h4>
                            <p className="text-sm text-muted-foreground">{result.assignmentName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(result.checkedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                              {result.score}%
                            </div>
                            <Badge className={`${getGradeStyle(result.grade)}`}>
                              {result.grade}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold">No results stored yet</p>
                <p className="text-sm text-muted-foreground">
                  Checked papers will appear here after saving results
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};