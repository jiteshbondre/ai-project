import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Download, 
  Search, 
  Filter, 
  Eye, 
  BarChart3, 
  Users, 
  Calendar,
  FileSpreadsheet,
  Trash2
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

interface ClassResultsManagerProps {
  results: PaperResult[];
  onDeleteResult: (id: string) => void;
}

export const ClassResultsManager = ({ results, onDeleteResult }: ClassResultsManagerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const { toast } = useToast();

  const assignments = Array.from(new Set(results.map(r => r.assignmentName)));
  
  const filteredResults = results
    .filter(result => {
      const matchesSearch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.assignmentName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAssignment = !selectedAssignment || result.assignmentName === selectedAssignment;
      return matchesSearch && matchesAssignment;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.score - a.score;
        case "name":
          return a.studentName.localeCompare(b.studentName);
        case "assignment":
          return a.assignmentName.localeCompare(b.assignmentName);
        default:
          return new Date(b.checkedDate).getTime() - new Date(a.checkedDate).getTime();
      }
    });

  const getStats = () => {
    if (results.length === 0) return { avgScore: 0, totalStudents: 0, totalAssignments: 0 };
    
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    const totalStudents = new Set(results.map(r => r.studentName)).size;
    const totalAssignments = new Set(results.map(r => r.assignmentName)).size;
    
    return { avgScore: Math.round(avgScore), totalStudents, totalAssignments };
  };

  const stats = getStats();

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

  const handleExportResults = () => {
    // Simulate CSV export
    const csvContent = [
      ["Student Name", "Assignment", "Score", "Grade", "Date Checked"],
      ...filteredResults.map(result => [
        result.studentName,
        result.assignmentName,
        result.score.toString(),
        result.grade,
        new Date(result.checkedDate).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `class-results-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Results exported",
      description: "Class results have been downloaded as CSV file.",
    });
  };

  const handleDeleteResult = (id: string) => {
    onDeleteResult(id);
    toast({
      title: "Result deleted",
      description: "Student result has been removed from records.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold text-primary">{stats.avgScore}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Students</p>
                <p className="text-2xl font-bold text-success">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assignments</p>
                <p className="text-2xl font-bold text-ai-purple">{stats.totalAssignments}</p>
              </div>
              <Calendar className="h-8 w-8 text-ai-purple" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Class Results Management
          </CardTitle>
          <CardDescription>
            View, filter, and export all student paper results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students or assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                className="px-3 py-2 border border-border rounded-md bg-background min-w-[160px]"
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
              >
                <option value="">All Assignments</option>
                {assignments.map((assignment) => (
                  <option key={assignment} value={assignment}>
                    {assignment}
                  </option>
                ))}
              </select>
              
              <select
                className="px-3 py-2 border border-border rounded-md bg-background min-w-[120px]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="score">Sort by Score</option>
                <option value="name">Sort by Name</option>
                <option value="assignment">Sort by Assignment</option>
              </select>
              
              <Button onClick={handleExportResults} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      <Card>
        <CardContent className="p-0">
          {filteredResults.length > 0 ? (
            <div className="space-y-0">
              {filteredResults.map((result, index) => (
                <div 
                  key={result.id} 
                  className={`p-4 border-b border-border last:border-b-0 hover:bg-accent/50 transition-colors ${
                    index % 2 === 0 ? 'bg-background' : 'bg-accent/20'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-ai-purple/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">
                          {result.studentName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold truncate">{result.studentName}</h4>
                        <p className="text-sm text-muted-foreground truncate">{result.assignmentName}</p>
                        <p className="text-xs text-muted-foreground">
                          Checked: {new Date(result.checkedDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </div>
                        <Badge className={`${getGradeStyle(result.grade)} text-xs`}>
                          {result.grade}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteResult(result.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold">No results found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || selectedAssignment
                  ? "Try adjusting your search filters"
                  : "Start checking papers to see results here"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};