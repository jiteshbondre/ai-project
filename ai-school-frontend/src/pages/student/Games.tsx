import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Gamepad2, 
  Trophy, 
  Star, 
  Target,
  BookOpen,
  GraduationCap,
  Zap,
  Crown,
  Medal
} from "lucide-react";
import MathQuiz from "@/components/games/MathQuiz";
import ScienceQuiz from "@/components/games/ScienceQuiz";
import EnglishGame from "@/components/games/EnglishGame";
import RoboticsGame from "@/components/games/RoboticsGame";
import WritingGame from "@/components/games/WritingGame";

interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  games: number;
  completed: number;
}

interface Game {
  id: string;
  title: string;
  subject: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  completed: boolean;
}

const Games = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const subjects: Subject[] = [
    {
      id: "math",
      name: "Mathematics",
      icon: "📊",
      color: "from-blue-400 to-blue-600",
      games: 8,
      completed: 3
    },
    {
      id: "science",
      name: "Science",
      icon: "🧪",
      color: "from-green-400 to-green-600",
      games: 6,
      completed: 2
    },
    {
      id: "english",
      name: "English",
      icon: "📚",
      color: "from-purple-400 to-purple-600",
      games: 5,
      completed: 1
    },
    {
      id: "robotics",
      name: "Robotics",
      icon: "🤖",
      color: "from-orange-400 to-orange-600",
      games: 4,
      completed: 0
    },
    {
      id: "writing",
      name: "Creative Writing",
      icon: "✍️",
      color: "from-pink-400 to-pink-600",
      games: 3,
      completed: 0
    }
  ];

  const featuredGame = {
    id: "fraction-pizza",
    title: "Fraction Frenzy Pizza Party!",
    subject: "Mathematics",
    description: "Learn fractions by creating delicious pizzas! Cut, share, and compare fractions in this fun cooking adventure.",
    difficulty: "Medium" as const,
    points: 150,
    thumbnail: "🍕"
  };

  const games: Game[] = [
    {
      id: "1",
      title: "Algebra Adventure",
      subject: "Mathematics",
      description: "Solve equations to unlock treasure chests!",
      difficulty: "Medium",
      points: 120,
      completed: true
    },
    {
      id: "2",
      title: "Cell Explorer",
      subject: "Science",
      description: "Navigate through plant and animal cells",
      difficulty: "Easy",
      points: 80,
      completed: true
    },
    {
      id: "3",
      title: "Grammar Quest",
      subject: "English",
      description: "Battle grammar monsters with correct sentences",
      difficulty: "Hard",
      points: 200,
      completed: false
    }
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSubjectById = (id: string) => subjects.find(s => s.id === id);

  const openGame = (subjectId: string) => {
    setActiveGame(subjectId);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {activeGame === "math" && <MathQuiz onClose={() => setActiveGame(null)} />}
      {activeGame === "science" && <ScienceQuiz onClose={() => setActiveGame(null)} />}
      {activeGame === "english" && <EnglishGame onClose={() => setActiveGame(null)} />}
      {activeGame === "robotics" && <RoboticsGame onClose={() => setActiveGame(null)} />}
      {activeGame === "writing" && <WritingGame onClose={() => setActiveGame(null)} />}
      {/* Header */}
      <header className="bg-gradient-to-r from-warning to-primary text-white p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-4">
              <Link to="/student/dashboard" className="hover:text-primary-light">
                <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
                <p className="text-primary-light text-sm sm:text-base">Fun Learning Games</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-base sm:text-lg font-semibold">{user.school}</p>
              <p className="text-xs sm:text-sm text-primary-light">AI Generated Games</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Featured Game */}
            <Card className="card-elevated bg-gradient-to-br from-warning-light to-primary-light border-warning/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="text-6xl">{featuredGame.thumbnail}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-warning mb-2">{featuredGame.title}</h2>
                    <p className="text-muted-foreground mb-4">{featuredGame.description}</p>
                    <div className="flex items-center gap-4 mb-4">
                      <Badge className={getDifficultyColor(featuredGame.difficulty)}>
                        {featuredGame.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-warning">
                        <Trophy className="h-4 w-4" />
                        <span className="font-semibold">{featuredGame.points} points</span>
                      </div>
                    </div>
                    <Button className="btn-primary hover-scale" onClick={() => openGame("math")}>
                      <Gamepad2 className="h-4 w-4 mr-2" />
                      PLAY NOW!
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subject Selection */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Choose a Subject to Play
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((subject) => (
                    <Card 
                      key={subject.id} 
                      className={`cursor-pointer transition-all hover-lift ${
                        selectedSubject === subject.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => openGame(subject.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl`}>
                          {subject.icon}
                        </div>
                        <h3 className="font-semibold mb-2">{subject.name}</h3>
                        <div className="flex justify-between text-sm text-muted-foreground mb-3">
                          <span>Play game</span>
                          <span>{subject.completed} completed</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 mb-3">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${subject.color}`}
                            style={{ width: `${(subject.completed / subject.games) * 100}%` }}
                          ></div>
                        </div>
                        {subject.completed > 0 && (
                          <div className="flex justify-center">
                            <Badge className="status-complete">
                              <Star className="h-3 w-3 mr-1" />
                              {subject.completed} played
                            </Badge>
                          </div>
                        )}
                        <Button className="w-full mt-3 btn-primary" onClick={(e) => { e.stopPropagation(); openGame(subject.id); }}>
                          <Gamepad2 className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Games List */}
            {selectedSubject && (
              <Card className="card-elevated animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-primary" />
                    {getSubjectById(selectedSubject)?.name} Games
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {games
                      .filter(game => game.subject.toLowerCase().includes(getSubjectById(selectedSubject)?.name.toLowerCase().split(' ')[0] || ''))
                      .map((game) => (
                        <div key={game.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary/20 rounded-lg flex items-center justify-center">
                              <Gamepad2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{game.title}</h4>
                              <p className="text-sm text-muted-foreground">{game.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getDifficultyColor(game.difficulty)}>
                                  {game.difficulty}
                                </Badge>
                                <span className="text-xs text-warning flex items-center gap-1">
                                  <Trophy className="h-3 w-3" />
                                  {game.points} pts
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {game.completed && (
                              <Badge className="status-complete">
                                <Crown className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                            <Button className={game.completed ? "btn-success" : "btn-primary"}>
                              {game.completed ? "Play Again" : "Start Game"}
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
                      <BookOpen className="h-4 w-4 mr-2" />
                      Your Homework Status
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Player Stats */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-warning" />
                  Your Gaming Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Points</span>
                    <span className="font-bold text-warning">1,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Games Completed</span>
                    <span className="font-semibold">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Current Streak</span>
                    <span className="font-semibold text-success">3 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Rank</span>
                    <Badge className="bg-warning-light text-warning">
                      <Medal className="h-3 w-3 mr-1" />
                      Bronze
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-sm">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-accent rounded">
                    <Trophy className="h-4 w-4 text-warning" />
                    <div>
                      <p className="text-sm font-medium">Math Wizard</p>
                      <p className="text-xs text-muted-foreground">Complete 5 math games</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-accent rounded">
                    <Zap className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">Speed Demon</p>
                      <p className="text-xs text-muted-foreground">Complete game in under 2 minutes</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;