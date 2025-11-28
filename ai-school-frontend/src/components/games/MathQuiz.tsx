import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

const MathQuiz = ({ onClose }: { onClose: () => void }) => {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const questions: Question[] = [
    {
      question: "What is 15 × 8?",
      options: ["120", "130", "115", "125"],
      correct: 0
    },
    {
      question: "Solve: 144 ÷ 12 = ?",
      options: ["10", "11", "12", "13"],
      correct: 2
    },
    {
      question: "What is 25% of 200?",
      options: ["40", "50", "60", "75"],
      correct: 1
    },
    {
      question: "If x + 7 = 15, what is x?",
      options: ["6", "7", "8", "9"],
      correct: 2
    },
    {
      question: "What is the area of a square with side 9cm?",
      options: ["72 cm²", "81 cm²", "90 cm²", "99 cm²"],
      correct: 1
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    setTimeout(() => {
      if (answerIndex === questions[currentQuestion].correct) {
        setScore(score + 1);
      }

      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        toast({
          title: "Quiz Complete!",
          description: `You scored ${score + (answerIndex === questions[currentQuestion].correct ? 1 : 0)}/${questions.length}`,
        });
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Math Quiz Challenge
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
                <div className="flex justify-between text-sm mb-2">
                  <span>Question {currentQuestion + 1}/{questions.length}</span>
                  <span>Score: {score}</span>
                </div>
                <Progress value={((currentQuestion + 1) / questions.length) * 100} />
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-6">{questions[currentQuestion].question}</h3>
                <div className="grid gap-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`h-auto py-4 text-left justify-start text-base ${
                        selectedAnswer === index
                          ? index === questions[currentQuestion].correct
                            ? "bg-success/20 border-success"
                            : "bg-destructive/20 border-destructive"
                          : ""
                      }`}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-warning" />
              <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
              <p className="text-3xl font-bold text-primary mb-4">
                {score}/{questions.length}
              </p>
              <p className="text-muted-foreground mb-6">
                {score === questions.length
                  ? "Perfect score! You're a math genius! 🌟"
                  : score >= questions.length * 0.7
                  ? "Great job! Keep practicing! 👍"
                  : "Good effort! Try again to improve! 💪"}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetQuiz} className="btn-primary">
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

export default MathQuiz;
