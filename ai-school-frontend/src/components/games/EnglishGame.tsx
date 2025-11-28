import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EnglishGame = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const words = [
    { scrambled: "TAC", answer: "CAT", hint: "A furry pet that meows" },
    { scrambled: "KOBO", answer: "BOOK", hint: "You read this" },
    { scrambled: "RTEE", answer: "TREE", hint: "A tall plant with leaves" },
    { scrambled: "NUSN", answer: "SUNN", hint: "It gives us light and warmth" },
    { scrambled: "ERTAW", answer: "WATER", hint: "You drink this" }
  ];

  const handleSubmit = () => {
    if (userAnswer.toUpperCase() === words[currentWord].answer) {
      setScore(score + 1);
      setFeedback("Correct! 🎉");
      toast({
        title: "Correct!",
        description: "Great job!",
      });
    } else {
      setFeedback(`Incorrect. The answer was ${words[currentWord].answer}`);
    }

    setTimeout(() => {
      if (currentWord + 1 < words.length) {
        setCurrentWord(currentWord + 1);
        setUserAnswer("");
        setFeedback("");
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const resetGame = () => {
    setCurrentWord(0);
    setScore(0);
    setShowResult(false);
    setUserAnswer("");
    setFeedback("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-[hsl(var(--ai-purple))]" />
              Word Unscramble Challenge
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!showResult ? (
            <>
              <div className="mb-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Word {currentWord + 1} of {words.length}
                </p>
                <p className="text-sm text-muted-foreground">Score: {score}</p>
              </div>

              <div className="mb-6 text-center">
                <div className="bg-accent p-8 rounded-lg mb-4">
                  <h3 className="text-3xl font-bold tracking-wider text-[hsl(var(--ai-purple))]">
                    {words[currentWord].scrambled}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Hint: {words[currentWord].hint}
                </p>
                
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="mb-4 text-center text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                
                {feedback && (
                  <p className={`mb-4 font-semibold ${
                    feedback.includes("Correct") ? "text-success" : "text-destructive"
                  }`}>
                    {feedback}
                  </p>
                )}
                
                <Button onClick={handleSubmit} className="btn-primary" disabled={!userAnswer.trim()}>
                  <Check className="h-4 w-4 mr-2" />
                  Submit Answer
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-warning" />
              <h3 className="text-2xl font-bold mb-2">Game Complete!</h3>
              <p className="text-3xl font-bold text-[hsl(var(--ai-purple))] mb-4">
                {score}/{words.length}
              </p>
              <p className="text-muted-foreground mb-6">
                {score === words.length
                  ? "Perfect! You're a word master! 📚"
                  : score >= words.length * 0.7
                  ? "Great vocabulary skills! 📖"
                  : "Keep practicing! 💪"}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetGame} className="btn-primary">
                  Play Again
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

export default EnglishGame;
