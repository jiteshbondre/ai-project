// Parent Dashboard Login Component
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GraduationCap, Brain, Users, Shield, Heart, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [schoolName, setSchoolName] = useState("NIRMAL SCHOOL");
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newAccount, setNewAccount] = useState({
    schoolName: "NIRMAL SCHOOL",
    fullName: "",
    className: "",
    email: "",
    password: "",
    confirmPassword: "",
    medium: "English",
    contactNo: "",
    dob: "",
    gender: "",
    address: "",
    admissionDate: "",
    curriculumId: ""
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Map frontend userType to backend role
  const mapUserTypeToRole = (userType: string): string => {
    const roleMap: Record<string, string> = {
      student: "STUDENT",
      teacher: "TEACHER",
      principal: "PRINCIPAL",
      management: "MANAGER"
    };
    return roleMap[userType] || userType.toUpperCase();
  };

  // Map backend role to frontend route
  const mapRoleToRoute = (role: string): string => {
    const routeMap: Record<string, string> = {
      STUDENT: "/student/dashboard",
      TEACHER: "/teacher/dashboard",
      PRINCIPAL: "/admin/dashboard",
      MANAGER: "/admin/dashboard"
    };
    return routeMap[role] || "/";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType || !username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          schoolName: schoolName,
          username: username,
          password: password,
          role: mapUserTypeToRole(userType),
        }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Store user data and token in localStorage
        localStorage.setItem("user", JSON.stringify({
          username: username,
          userType: userType,
          role: data.role,
          userId: data.userId,
          schoolId: data.schoolId,
          schoolName: schoolName,
          token: data.token
        }));
        localStorage.setItem("token", data.token);

        toast({
          title: "Login successful!",
          description: data.message || "Welcome back!",
        });

        // Navigate based on role from API response
        const route = mapRoleToRoute(data.role);
        navigate(route);
      } else {
        toast({
          title: "Login failed",
          description: data.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Reset link sent!",
      description: `Password reset instructions have been sent to ${forgotEmail}`,
    });
    setForgotPasswordOpen(false);
    setForgotEmail("");
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newAccount.password !== newAccount.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!newAccount.fullName || !newAccount.email || !newAccount.className || !newAccount.password || !newAccount.medium) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);

    try {
      // Prepare request body
      const requestBody: any = {
        schoolName: newAccount.schoolName,
        fullName: newAccount.fullName,
        className: newAccount.className,
        email: newAccount.email,
        password: newAccount.password,
        medium: newAccount.medium,
      };

      // Add optional fields if provided
      if (newAccount.contactNo) requestBody.contactNo = newAccount.contactNo;
      if (newAccount.dob) requestBody.dob = newAccount.dob;
      if (newAccount.gender) requestBody.gender = newAccount.gender;
      if (newAccount.address) requestBody.address = newAccount.address;
      if (newAccount.admissionDate) requestBody.admissionDate = newAccount.admissionDate;
      if (newAccount.curriculumId) requestBody.curriculumId = parseInt(newAccount.curriculumId);

      const response = await fetch("/api/students/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Registration failed" }));
        toast({
          title: "Registration failed",
          description: errorData.message || `Server error: ${response.status}`,
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();

      if (data.studentId) {
        toast({
          title: "Account created successfully!",
          description: data.message || "You can now log in with your credentials.",
        });
        setCreateAccountOpen(false);
        setNewAccount({
          schoolName: "NIRMAL SCHOOL",
          fullName: "",
          className: "",
          email: "",
          password: "",
          confirmPassword: "",
          medium: "English",
          contactNo: "",
          dob: "",
          gender: "",
          address: "",
          admissionDate: "",
          curriculumId: ""
        });
      } else {
        toast({
          title: "Registration failed",
          description: data.message || "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to server. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "student": return <GraduationCap className="h-5 w-5" />;
      case "teacher": return <Brain className="h-5 w-5" />;
      case "parent": return <Heart className="h-5 w-5" />;
      case "principal": return <Users className="h-5 w-5" />;
      case "management": return <Shield className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-ai-purple/5 flex items-center justify-center p-4">
      {/* Top Navigation */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md animate-scale-in">
        {/* School Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-ai-purple rounded-3xl mb-4 shadow-[var(--shadow-ai)] animate-float">
            <GraduationCap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">NIRMAL SCHOOL</h1>
          <p className="text-lg font-semibold text-muted-foreground">Personalised App</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
            Personalized app for students, teachers, principals and management teams with custom school branding.
          </p>
        </div>

        <Card className="border-2 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold text-gradient">Welcome Back!</CardTitle>
            <CardDescription className="text-base">
              Sign in to access your AI-powered learning platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input
                  id="schoolName"
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Enter your school name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userType">I am a</Label>
                <Select value={userType} onValueChange={setUserType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">
                      <div className="flex items-center gap-2">
                        {getUserTypeIcon("student")}
                        Student
                      </div>
                    </SelectItem>
                    <SelectItem value="teacher">
                      <div className="flex items-center gap-2">
                        {getUserTypeIcon("teacher")}
                        Teacher
                      </div>
                    </SelectItem>
                    <SelectItem value="principal">
                      <div className="flex items-center gap-2">
                        {getUserTypeIcon("principal")}
                        Principal
                      </div>
                    </SelectItem>
                    <SelectItem value="management">
                      <div className="flex items-center gap-2">
                        {getUserTypeIcon("management")}
                        Management
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username (Email)</Label>
                <Input
                  id="username"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button 
                type="submit" 
                variant="gradient" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "LOG IN"}
              </Button>

              <div className="text-center space-y-3">
                <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary-hover underline transition-colors duration-300"
                    >
                      Forgot Username/Password?
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Reset Password</DialogTitle>
                      <DialogDescription>
                        Enter your email address and we'll send you instructions to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">Email Address</Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setForgotPasswordOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" variant="gradient" className="flex-1">
                          Send Reset Link
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Dialog open={createAccountOpen} onOpenChange={setCreateAccountOpen}>
                    <DialogTrigger asChild>
                      <button className="text-primary hover:text-primary-hover underline font-medium transition-colors duration-300">
                        Create New Account
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Create New Account</DialogTitle>
                        <DialogDescription>
                          Fill in your details to create your account
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateAccount} className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-schoolname">School Name *</Label>
                          <Input
                            id="new-schoolname"
                            type="text"
                            value={newAccount.schoolName}
                            onChange={(e) => setNewAccount({...newAccount, schoolName: e.target.value})}
                            placeholder="Enter your school name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new-fullname">Full Name *</Label>
                          <Input
                            id="new-fullname"
                            type="text"
                            value={newAccount.fullName}
                            onChange={(e) => setNewAccount({...newAccount, fullName: e.target.value})}
                            placeholder="Enter your full name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new-email">Email Address *</Label>
                          <Input
                            id="new-email"
                            type="email"
                            value={newAccount.email}
                            onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                            placeholder="Enter your email"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-classname">Class Name *</Label>
                            <Input
                              id="new-classname"
                              type="text"
                              value={newAccount.className}
                              onChange={(e) => setNewAccount({...newAccount, className: e.target.value})}
                              placeholder="e.g., 10-A"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="new-medium">Medium *</Label>
                            <Select 
                              value={newAccount.medium} 
                              onValueChange={(value) => setNewAccount({...newAccount, medium: value})} 
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select medium" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="English">English</SelectItem>
                                <SelectItem value="Hindi">Hindi</SelectItem>
                                <SelectItem value="Marathi">Marathi</SelectItem>
                                <SelectItem value="Gujarati">Gujarati</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-dob">Date of Birth</Label>
                            <Input
                              id="new-dob"
                              type="date"
                              value={newAccount.dob}
                              onChange={(e) => setNewAccount({...newAccount, dob: e.target.value})}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="new-gender">Gender</Label>
                            <Select 
                              value={newAccount.gender} 
                              onValueChange={(value) => setNewAccount({...newAccount, gender: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new-contact">Contact Number</Label>
                          <Input
                            id="new-contact"
                            type="tel"
                            value={newAccount.contactNo}
                            onChange={(e) => setNewAccount({...newAccount, contactNo: e.target.value})}
                            placeholder="Enter contact number"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new-address">Address</Label>
                          <Input
                            id="new-address"
                            type="text"
                            value={newAccount.address}
                            onChange={(e) => setNewAccount({...newAccount, address: e.target.value})}
                            placeholder="Enter your address"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-admission-date">Admission Date</Label>
                            <Input
                              id="new-admission-date"
                              type="date"
                              value={newAccount.admissionDate}
                              onChange={(e) => setNewAccount({...newAccount, admissionDate: e.target.value})}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="new-curriculum-id">Curriculum ID</Label>
                            <Input
                              id="new-curriculum-id"
                              type="number"
                              value={newAccount.curriculumId}
                              onChange={(e) => setNewAccount({...newAccount, curriculumId: e.target.value})}
                              placeholder="Optional"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new-password">Password *</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={newAccount.password}
                            onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                            placeholder="Create a password"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="new-confirm-password">Confirm Password *</Label>
                          <Input
                            id="new-confirm-password"
                            type="password"
                            value={newAccount.confirmPassword}
                            onChange={(e) => setNewAccount({...newAccount, confirmPassword: e.target.value})}
                            placeholder="Confirm your password"
                            required
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCreateAccountOpen(false)}
                            className="flex-1"
                            disabled={isRegistering}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            variant="gradient" 
                            className="flex-1"
                            disabled={isRegistering}
                          >
                            {isRegistering ? "Registering..." : "Create Account"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;