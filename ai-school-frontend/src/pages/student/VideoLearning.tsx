import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Video, 
  Brain, 
  Clock, 
  BookOpen,
  GraduationCap,
  Sparkles,
  Calendar,
  TrendingUp,
  Info
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import VideoPlayer from "@/components/VideoPlayer";

interface VideoItem {
  id: string;
  title: string;
  subject: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  status: "completed" | "in-progress" | "new";
  progress?: number;
  createdAt: string;
  description?: string;
  subjectId?: number;
}

const VideoLearning = () => {
  const [user, setUser] = useState<any>(null);
  const [videoTopic, setVideoTopic] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatingTopic, setGeneratingTopic] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.userId) {
        fetchVideos(parsedUser.userId);
        fetchSubjects(parsedUser.userId);
      }
    }
  }, []);

  const fetchSubjects = async (studentId: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/students/${studentId}/subjects`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchVideos = async (studentId: number) => {
    setIsLoadingVideos(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/students/${studentId}/videos`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (response.ok) {
        const videoData = await response.json();
        // Transform API response to VideoItem format
        const transformedVideos: VideoItem[] = videoData.map((video: any) => ({
          id: video.videoId?.toString() || Date.now().toString(),
          title: video.title || "Untitled Video",
          subject: video.subjectName || "General",
          duration: "15:00", // Default duration as API doesn't provide it
          thumbnail: video.videoType || "ai-generated",
          videoUrl: video.url || "",
          status: "new" as const,
          progress: 0,
          createdAt: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          description: `Educational video about ${video.title}`,
          subjectId: video.subjectId,
        }));
        setVideos(transformedVideos);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast({
        title: "Error",
        description: "Failed to load videos. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!videoTopic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a video topic",
        variant: "destructive",
      });
      return;
    }

    if (!user || !user.userId) {
      toast({
        title: "Error",
        description: "Please log in to generate videos",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSubjectId) {
      toast({
        title: "Error",
        description: "Please select a subject",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratingTopic(videoTopic);

    // Simulate progress while API call is in progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          return prev; // Don't go to 100 until API responds
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    try {
      const token = localStorage.getItem("token");
      
      const requestBody: any = {
        studentId: user.userId,
        subjectId: selectedSubjectId,
        topicContext: videoTopic,
      };

      // Add optional fields if provided
      if (videoTitle.trim()) {
        requestBody.title = videoTitle.trim();
      }
      if (user.teacherId) {
        requestBody.teacherId = user.teacherId;
      }

      const response = await fetch("http://localhost:8080/api/ai/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(requestBody),
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.videoId && data.url) {
        // Add new video to library
        const subjectName = subjects.find(s => s.subjectId === selectedSubjectId)?.subjectName || "General";
        const newVideo: VideoItem = {
          id: data.videoId.toString(),
          title: data.title || videoTitle || videoTopic,
          subject: subjectName,
          duration: "15:00",
          thumbnail: "ai-generated",
          videoUrl: data.url,
          status: "new" as const,
          progress: 0,
          createdAt: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          description: `AI-generated educational video about ${videoTopic}`,
          subjectId: selectedSubjectId,
        };
        
        setVideos([newVideo, ...videos]);
        
        toast({
          title: "Video Generated Successfully!",
          description: data.message || `Your video on "${videoTopic}" is ready to watch.`,
        });
        setVideoTopic("");
        setVideoTitle("");
        setGeneratingTopic("");
      } else {
        throw new Error(data.message || "Failed to generate video");
      }
    } catch (error) {
      console.error("Error generating video:", error);
      clearInterval(progressInterval);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate video. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 1000);
    }
  };

  const handleWatchVideo = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleProgressUpdate = (videoId: string, progress: number) => {
    setVideos(videos.map(v => 
      v.id === videoId 
        ? { 
            ...v, 
            progress, 
            status: progress === 100 ? "completed" : progress > 0 ? "in-progress" : "new" 
          }
        : v
    ));
  };

  const handleVideoComplete = (videoId: string) => {
    toast({
      title: "Video Completed! 🎉",
      description: "Great job! Keep up the learning momentum.",
    });
  };

  const handleViewDetails = (video: VideoItem) => {
    toast({
      title: video.title,
      description: video.description || "Click 'Watch Now' to start learning!",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="status-complete">Completed</Badge>;
      case "in-progress":
        return <Badge className="status-pending">Watching</Badge>;
      case "new":
        return <Badge className="bg-blue-100 text-blue-600 border-blue-200">New</Badge>;
      default:
        return null;
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "mathematics":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "science":
        return "bg-green-100 text-green-700 border-green-200";
      case "history":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-8 rounded-b-[3rem] shadow-2xl mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/student/dashboard" className="hover:scale-110 transition-transform">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Video className="h-7 w-7" />
                </div>
              </Link>
              <div>
                <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                <p className="text-white/80 text-sm">Standard {user.standard} • Video Learning</p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-lg font-semibold">{user.school}</p>
              <p className="text-sm text-white/80">Learn Through Video</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Generation Section */}
            <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-3xl p-6 shadow-2xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">AI Video Teacher</h2>
                  <p className="text-white/80 text-sm">Generate custom learning videos</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-white/90 text-sm leading-relaxed">
                  Generate personalized explanation videos on any topic using our AI teacher. 
                  Perfect for study revision and understanding complex concepts!
                </p>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Input
                      value={videoTopic}
                      onChange={(e) => setVideoTopic(e.target.value)}
                      placeholder="Enter video topic/context..."
                      className="flex-1 bg-white/95 border-0 h-12 text-foreground placeholder:text-muted-foreground"
                      disabled={isGenerating}
                    />
                    <Input
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Video title (optional)"
                      className="flex-1 bg-white/95 border-0 h-12 text-foreground placeholder:text-muted-foreground"
                      disabled={isGenerating}
                    />
                  </div>
                  
                  {subjects.length > 0 && (
                    <select
                      value={selectedSubjectId || ""}
                      onChange={(e) => setSelectedSubjectId(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full bg-white/95 border-0 h-12 px-4 rounded-md text-foreground"
                      disabled={isGenerating}
                    >
                      <option value="">Select Subject *</option>
                      {subjects.map((subject) => (
                        <option key={subject.subjectId} value={subject.subjectId}>
                          {subject.subjectName}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  <Button 
                    onClick={handleGenerateVideo} 
                    disabled={isGenerating || !videoTopic.trim() || !selectedSubjectId}
                    className="bg-white text-purple-600 hover:bg-white/90 h-12 px-6 font-semibold w-full"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate Video"}
                  </Button>
                </div>

                {isGenerating && (
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-5 w-5 animate-pulse" />
                      <span className="font-semibold">Generating "{generatingTopic}"...</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={generationProgress} className="h-3 flex-1 bg-white/30" />
                      <span className="font-bold text-sm">{Math.round(generationProgress)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Library */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Video className="h-6 w-6 text-primary" />
                Your Video Library
              </h2>
              
              {isLoadingVideos ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading videos...</p>
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-8 bg-accent/50 rounded-2xl">
                  <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No videos available yet. Generate your first video above!</p>
                </div>
              ) : (
              <div className="grid gap-4">
                {videos.map((video, index) => {
                  const gradients = [
                    'from-[#667eea] to-[#764ba2]',
                    'from-[#f093fb] to-[#f5576c]',
                    'from-[#4facfe] to-[#00f2fe]',
                    'from-[#43e97b] to-[#38f9d7]',
                    'from-[#fa709a] to-[#fee140]',
                  ];
                  const gradient = gradients[index % gradients.length];
                  
                  return (
                    <div 
                      key={video.id} 
                      className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}
                    >
                      <div className="flex items-start gap-6">
                        {/* Circular Progress with Thumbnail */}
                        <div className="flex-shrink-0 relative">
                          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <Play className="h-10 w-10 text-white drop-shadow-lg" />
                          </div>
                          {video.progress !== undefined && video.progress > 0 && (
                            <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-800">{video.progress}</div>
                                <div className="text-[8px] text-gray-600 -mt-1">%</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Video Details */}
                        <div className="flex-1 text-white min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0 mr-3">
                              <h3 className="font-bold text-xl mb-2 leading-tight">{video.title}</h3>
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                                  {video.subject}
                                </div>
                                <span className="text-sm text-white/80 flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {video.duration}
                                </span>
                                <span className="text-sm text-white/80 flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {video.createdAt}
                                </span>
                              </div>
                            </div>
                            {video.status === "completed" && (
                              <Badge className="bg-white/90 text-green-600 border-0 font-semibold shrink-0">
                                ✓ Completed
                              </Badge>
                            )}
                            {video.status === "in-progress" && (
                              <Badge className="bg-white/90 text-orange-600 border-0 font-semibold shrink-0">
                                Watching
                              </Badge>
                            )}
                            {video.status === "new" && (
                              <Badge className="bg-white/90 text-blue-600 border-0 font-semibold shrink-0">
                                New
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-3 mt-4">
                            <Button 
                              onClick={() => handleWatchVideo(video)}
                              className="bg-white text-gray-800 hover:bg-white/90 font-semibold shadow-lg"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              {video.status === "new" ? "Watch Now" : video.status === "in-progress" ? "Continue" : "Rewatch"}
                            </Button>
                            <Button 
                              onClick={() => handleViewDetails(video)}
                              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 font-semibold"
                            >
                              <Info className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Navigation */}
            <div className="bg-gradient-to-br from-white to-accent/20 rounded-3xl p-5 shadow-lg">
              <h3 className="font-bold text-lg mb-4 text-foreground">Quick Navigation</h3>
              <div className="space-y-2">
                <Link to="/student/dashboard">
                  <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 font-medium">
                    <BookOpen className="h-4 w-4 mr-3" />
                    Home
                  </Button>
                </Link>
                <Link to="/student/progress">
                  <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 font-medium">
                    <TrendingUp className="h-4 w-4 mr-3" />
                    Learning Path
                  </Button>
                </Link>
                <Link to="/student/homework">
                  <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 font-medium">
                    <BookOpen className="h-4 w-4 mr-3" />
                    Homework
                  </Button>
                </Link>
                <Link to="/student/ai-teacher">
                  <Button variant="ghost" className="w-full justify-start hover:bg-primary/10 font-medium">
                    <Brain className="h-4 w-4 mr-3" />
                    AI Teacher
                  </Button>
                </Link>
              </div>
            </div>

            {/* Learning Statistics */}
            <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-3xl p-5 shadow-lg text-white">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5" />
                <h3 className="font-bold text-lg">Learning Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-3xl font-bold mb-1">{videos.length}</div>
                  <div className="text-sm text-white/80">Videos in Library</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-3xl font-bold mb-1">2h 45m</div>
                  <div className="text-sm text-white/80">Total Watch Time</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-3xl font-bold mb-1">
                    {videos.filter(v => v.status === "completed").length}
                  </div>
                  <div className="text-sm text-white/80">Completed Videos</div>
                </div>
              </div>
            </div>

            {/* Popular Topics */}
            <div className="bg-gradient-to-br from-white to-accent/20 rounded-3xl p-5 shadow-lg">
              <h3 className="font-bold text-lg mb-4 text-foreground">Popular Topics</h3>
              <div className="space-y-2">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-2xl text-sm font-medium shadow-md">
                  📐 Algebra Basics
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-2xl text-sm font-medium shadow-md">
                  🔬 Cell Biology
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-2xl text-sm font-medium shadow-md">
                  🏛️ World History
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          videoId={selectedVideo.id}
          videoTitle={selectedVideo.title}
          videoUrl={selectedVideo.videoUrl}
          currentProgress={selectedVideo.progress || 0}
          onProgressUpdate={(progress) => handleProgressUpdate(selectedVideo.id, progress)}
          onComplete={() => handleVideoComplete(selectedVideo.id)}
        />
      )}
    </div>
  );
};

export default VideoLearning;