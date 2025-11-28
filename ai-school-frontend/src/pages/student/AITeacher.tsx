import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Brain, 
  MessageCircle, 
  History, 
  BookOpen,
  GraduationCap,
  Sparkles,
  User,
  Bot
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  subject?: string;
}

interface PastQuestion {
  id: string;
  question: string;
  answer: string;
  subject: string;
  timestamp: string;
}

const AITeacher = () => {
  const [user, setUser] = useState<any>(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hi there! I'm your AI Teacher, specially trained to help you learn. You can ask me any question about your subjects, check your learning progress, or get help with homework. What would you like to learn today?",
      timestamp: new Date(),
    }
  ]);

  const [pastQuestions, setPastQuestions] = useState<PastQuestion[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    if (!user || !user.userId) {
      toast({
        title: "Error",
        description: "Please log in to ask questions",
        variant: "destructive",
      });
      return;
    }

    const questionText = currentMessage.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: questionText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: "Thinking...",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const token = localStorage.getItem("token");
      
      const requestBody: any = {
        studentId: user.userId,
        question: questionText,
      };

      // Add optional fields if available
      if (selectedSubjectId) {
        requestBody.subjectId = selectedSubjectId;
      }
      if (user.teacherId) {
        requestBody.teacherId = user.teacherId;
      }

      const response = await fetch("http://localhost:8080/api/ai/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Remove loading message and add actual response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          type: "ai",
          content: data.answer || "I'm sorry, I couldn't generate a response. Please try again.",
          timestamp: new Date(),
        }];
      });

      // Add to past questions
      if (data.answer) {
        setPastQuestions(prev => [{
          id: Date.now().toString(),
          question: questionText,
          answer: data.answer,
          subject: selectedSubjectId ? `Subject ${selectedSubjectId}` : "General",
          timestamp: new Date().toLocaleDateString(),
        }, ...prev]);
      }
    } catch (error) {
      console.error("Error asking question:", error);
      
      // Remove loading message and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          type: "ai",
          content: "I'm sorry, I encountered an error while processing your question. Please try again later.",
          timestamp: new Date(),
        }];
      });

      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-ai-purple to-primary text-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-4">
              <Link to="/student/dashboard" className="hover:text-primary-light">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
                <p className="text-primary-light text-sm sm:text-base">Ask QA with AI Teacher</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-base sm:text-lg font-semibold">{user.school}</p>
              <p className="text-xs sm:text-sm text-primary-light">AI specially trained for students</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="card-ai h-[500px] sm:h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-ai-purple" />
                  AI Teacher Chat
                  <Badge className="ai-pulse text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Powered
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages Area */}
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.type === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {message.type === "ai" && (
                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-ai-purple to-primary rounded-full flex items-center justify-center">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-4 rounded-lg ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground ml-auto"
                              : "bg-white border border-ai-purple/20"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                        {message.type === "user" && (
                          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-6 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Type your question here..."
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      className="btn-ai"
                      disabled={isLoading || !currentMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {isLoading 
                      ? "AI is thinking..." 
                      : "Ask me about any subject, homework help, or learning progress!"
                    }
                  </p>
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
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Your Homework Status
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Current Conversation Summary */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4" />
                  Current Conversation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {messages.length > 1 
                    ? `${messages.length - 1} questions asked in this session`
                    : "Start by asking a question!"
                  }
                </p>
                {messages.length > 2 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium">Last topic:</p>
                    <p className="text-xs text-muted-foreground">
                      {messages[messages.length - 2]?.content.substring(0, 50)}...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Past Questions */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <History className="h-4 w-4" />
                  Your Old Questions & Answers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pastQuestions.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No previous questions yet. Start asking to see your history here!
                    </p>
                  ) : (
                    pastQuestions.map((qa) => (
                      <div key={qa.id} className="p-3 bg-accent rounded-lg cursor-pointer hover:bg-accent/80 transition-colors">
                        <p className="text-xs font-medium text-primary">{qa.subject}</p>
                        <p className="text-sm font-medium">{qa.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">{qa.timestamp}</p>
                      </div>
                    ))
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

export default AITeacher;