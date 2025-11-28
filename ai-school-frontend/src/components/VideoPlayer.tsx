import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  BookOpen,
  CheckCircle,
  X
} from "lucide-react";

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoTitle: string;
  videoUrl: string;
  currentProgress: number;
  onProgressUpdate: (progress: number) => void;
  onComplete: () => void;
}

const VideoPlayer = ({ 
  isOpen, 
  onClose, 
  videoTitle, 
  videoUrl,
  currentProgress,
  onProgressUpdate,
  onComplete
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [watchProgress, setWatchProgress] = useState(currentProgress);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isOpen) {
      setWatchProgress(currentProgress);
    }
  }, [isOpen, currentProgress]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setWatchProgress((prev) => {
        const newProgress = Math.min(prev + 1, 100);
        onProgressUpdate(newProgress);
        
        if (newProgress === 100) {
          onComplete();
          clearInterval(interval);
        }
        
        return newProgress;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isPlaying, onProgressUpdate, onComplete]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{videoTitle}</span>
            <Badge variant={watchProgress === 100 ? "default" : "secondary"}>
              {watchProgress === 100 ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </>
              ) : (
                `${Math.round(watchProgress)}% Complete`
              )}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Video Player Area */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src={videoUrl}
              title={videoTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
            {/* Custom Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="space-y-2">
                <Progress value={watchProgress} className="h-1" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={handleToggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>
                    <span className="text-white text-sm ml-2">
                      {Math.round(watchProgress)}%
                    </span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowNotes(!showNotes)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {showNotes ? "Hide Notes" : "Take Notes"}
            </Button>
            {watchProgress === 100 && (
              <Button variant="default" className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Take Quiz
              </Button>
            )}
          </div>

          {/* Notes Section */}
          {showNotes && (
            <div className="border rounded-lg p-4 bg-accent/50">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                My Learning Notes
              </h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write down your key learnings..."
                className="w-full h-32 p-3 rounded border bg-background resize-none"
              />
            </div>
          )}

          {/* Video Description */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">About this video</h4>
            <p className="text-sm text-muted-foreground">
              This educational video covers important concepts and provides clear explanations 
              to help you understand the topic better. Watch carefully and take notes!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayer;
