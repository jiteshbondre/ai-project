import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WritingGame = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const [currentPrompt, setCurrentPrompt] = useState(0);
  const [story, setStory] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [completedStories, setCompletedStories] = useState(0);

  const prompts = [
    {
      title: "The Magical Door",
      prompt: "You find a mysterious glowing door in your bedroom. What happens when you open it?",
      minWords: 50
    },
    {
      title: "Time Travel Adventure",
      prompt: "Your watch starts spinning backwards and suddenly you're in the past. Where and when did you travel to?",
      minWords: 50
    },
    {
      title: "Animal Kingdom",
      prompt: "You wake up and discover you can talk to animals! What do they tell you?",
      minWords: 50
    }
  ];

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleSubmit = () => {
    const wordCount = countWords(story);
    
    if (wordCount < prompts[currentPrompt].minWords) {
      toast({
        title: "Keep Writing!",
        description: `Write at least ${prompts[currentPrompt].minWords} words. You have ${wordCount} words.`,
        variant: "destructive"
      });
      return;
    }

    setCompletedStories(completedStories + 1);
    toast({
      title: "Great Story!",
      description: "Your creativity is amazing! 📝",
    });

    setTimeout(() => {
      if (currentPrompt + 1 < prompts.length) {
        setCurrentPrompt(currentPrompt + 1);
        setStory("");
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetGame = () => {
    setCurrentPrompt(0);
    setStory("");
    setCompletedStories(0);
    setShowResult(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl my-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[hsl(var(--ai-purple))]" />
              Creative Writing Challenge
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!showResult ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-4">
                  <span>Prompt {currentPrompt + 1}/{prompts.length}</span>
                  <span>Completed: {completedStories}</span>
                </div>
                
                <div className="bg-gradient-to-r from-[hsl(var(--ai-purple))]/10 to-[hsl(var(--primary))]/10 p-6 rounded-lg mb-4">
                  <h3 className="text-xl font-bold text-[hsl(var(--ai-purple))] mb-2">
                    {prompts[currentPrompt].title}
                  </h3>
                  <p className="text-muted-foreground">
                    {prompts[currentPrompt].prompt}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <Textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Start writing your story here..."
                  className="min-h-[200px] text-base"
                />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>Write at least {prompts[currentPrompt].minWords} words</span>
                  <span>{countWords(story)} words</span>
                </div>
              </div>

              <Button 
                onClick={handleSubmit} 
                className="btn-primary w-full"
                disabled={countWords(story) < prompts[currentPrompt].minWords}
              >
                Submit Story
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-warning" />
              <h3 className="text-2xl font-bold mb-2">All Stories Complete!</h3>
              <p className="text-3xl font-bold text-[hsl(var(--ai-purple))] mb-4">
                {completedStories}/{prompts.length}
              </p>
              <p className="text-muted-foreground mb-6">
                {completedStories === prompts.length
                  ? "Amazing creativity! You're a talented writer! ✍️"
                  : "Great imagination! Keep writing! 📚"}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetGame} className="btn-primary">
                  Write More Stories
                </Button>
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WritingGame;
