import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RoboticsGame = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const [level, setLevel] = useState(0);
  const [sequence, setSequence] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const levels = [
    { target: ["UP", "RIGHT"], description: "Move to the star" },
    { target: ["RIGHT", "UP", "RIGHT"], description: "Navigate around the obstacle" },
    { target: ["UP", "UP", "RIGHT", "DOWN"], description: "Collect all coins" }
  ];

  const addMove = (direction: string) => {
    if (sequence.length < levels[level].target.length + 2) {
      setSequence([...sequence, direction]);
    }
  };

  const removeLastMove = () => {
    setSequence(sequence.slice(0, -1));
  };

  const checkSequence = () => {
    const isCorrect = JSON.stringify(sequence) === JSON.stringify(levels[level].target);
    
    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Success!",
        description: "Robot reached the goal! 🤖",
      });
      
      setTimeout(() => {
        if (level + 1 < levels.length) {
          setLevel(level + 1);
          setSequence([]);
        } else {
          setShowResult(true);
        }
      }, 1500);
    } else {
      toast({
        title: "Try Again",
        description: "The robot didn't reach the goal",
        variant: "destructive"
      });
      setSequence([]);
    }
  };

  const resetGame = () => {
    setLevel(0);
    setScore(0);
    setSequence([]);
    setShowResult(false);
  };

  const getIcon = (direction: string) => {
    switch (direction) {
      case "UP": return <ArrowUp className="h-4 w-4" />;
      case "DOWN": return <ArrowDown className="h-4 w-4" />;
      case "LEFT": return <ArrowLeft className="h-4 w-4" />;
      case "RIGHT": return <ArrowRight className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-warning" />
              Robot Programming Challenge
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
                  <span>Level {level + 1}/{levels.length}</span>
                  <span>Score: {score}</span>
                </div>
                <p className="text-center text-lg font-semibold mb-4">
                  {levels[level].description}
                </p>
                <div className="bg-accent p-8 rounded-lg mb-4 text-center">
                  <div className="text-6xl mb-2">🤖</div>
                  <p className="text-sm text-muted-foreground">Program the robot's path</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold mb-2">Your Sequence:</p>
                <div className="flex flex-wrap gap-2 min-h-[60px] p-4 border rounded-lg bg-muted/50">
                  {sequence.length === 0 ? (
                    <span className="text-muted-foreground">Click arrows to add moves...</span>
                  ) : (
                    sequence.map((move, index) => (
                      <div key={index} className="bg-primary text-primary-foreground px-3 py-2 rounded flex items-center gap-1">
                        {getIcon(move)}
                        <span className="text-xs">{move}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div></div>
                <Button onClick={() => addMove("UP")} variant="outline" className="h-16">
                  <ArrowUp className="h-6 w-6" />
                </Button>
                <div></div>
                <Button onClick={() => addMove("LEFT")} variant="outline" className="h-16">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <Button onClick={() => addMove("DOWN")} variant="outline" className="h-16">
                  <ArrowDown className="h-6 w-6" />
                </Button>
                <Button onClick={() => addMove("RIGHT")} variant="outline" className="h-16">
                  <ArrowRight className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={checkSequence} className="btn-primary flex-1" disabled={sequence.length === 0}>
                  Run Program
                </Button>
                <Button onClick={removeLastMove} variant="outline" disabled={sequence.length === 0}>
                  Undo
                </Button>
                <Button onClick={() => setSequence([])} variant="outline" disabled={sequence.length === 0}>
                  Clear
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-warning" />
              <h3 className="text-2xl font-bold mb-2">All Levels Complete!</h3>
              <p className="text-3xl font-bold text-warning mb-4">
                {score}/{levels.length}
              </p>
              <p className="text-muted-foreground mb-6">
                {score === levels.length
                  ? "Perfect! You're a coding genius! 🚀"
                  : "Great programming skills! 🤖"}
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

export default RoboticsGame;
