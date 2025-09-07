import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  RotateCcw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";

const Quiz = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Mock quiz data
  const quizData = {
    id: "network-security-basics",
    title: "Network Security Fundamentals",
    description:
      "Test your knowledge of basic network security concepts, protocols, and best practices.",
    difficulty: "Intermediate",
    category: "Network Security",
    timeLimit: 1800, // 30 minutes in seconds
    totalPoints: 100,
    passingScore: 70,
  };

  const questions = [
    {
      id: "1",
      type: "multiple-choice",
      question: "Which of the following is NOT a layer in the OSI model?",
      options: [
        "Physical Layer",
        "Transport Layer",
        "Security Layer",
        "Application Layer",
      ],
      correctAnswer: 2,
      explanation:
        'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application. There is no "Security Layer" in the OSI model.',
      difficulty: "Beginner",
      points: 10,
    },
    {
      id: "2",
      type: "true-false",
      question: "HTTPS uses port 443 by default.",
      options: ["True", "False"],
      correctAnswer: 0,
      explanation:
        "Correct! HTTPS (HTTP Secure) uses port 443 by default, while HTTP uses port 80.",
      difficulty: "Beginner",
      points: 5,
    },
    {
      id: "3",
      type: "fill-blank",
      question:
        "A _______ is a network security device that monitors and controls incoming and outgoing network traffic.",
      correctAnswer: "firewall",
      explanation:
        "A firewall is a network security device that monitors and controls network traffic based on predetermined security rules.",
      difficulty: "Intermediate",
      points: 15,
    },
    {
      id: "4",
      type: "scenario",
      scenario:
        "You notice unusual network traffic coming from an internal IP address at 3 AM, including large data transfers to an unknown external server.",
      question: "What is the MOST appropriate immediate response?",
      options: [
        "Ignore it as it might be automatic updates",
        "Immediately disconnect the device from the network",
        "Monitor the traffic for a few more days",
        "Send an email to the user asking about the activity",
      ],
      correctAnswer: 1,
      explanation:
        "The most appropriate immediate response is to disconnect the device from the network to prevent potential data exfiltration while investigating the incident.",
      difficulty: "Advanced",
      points: 20,
    },
    {
      id: "5",
      type: "multiple-choice",
      question:
        "Which encryption algorithm is considered most secure for modern applications?",
      options: ["DES", "MD5", "AES-256", "SHA-1"],
      correctAnswer: 2,
      explanation:
        "AES-256 (Advanced Encryption Standard with 256-bit key) is currently considered the gold standard for encryption and is widely used in modern secure applications.",
      difficulty: "Intermediate",
      points: 15,
    },
  ];

  // Timer effect
  useEffect(() => {
    let interval;
    if (quizStarted && !quizCompleted) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, quizCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = () => {
    setQuizCompleted(true);
    setShowResults(true);
  };

  const calculateResults = () => {
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];

      if (question.type === "fill-blank") {
        if (
          userAnswer?.toLowerCase().trim() ===
          question.correctAnswer.toString().toLowerCase()
        ) {
          correctCount++;
          earnedPoints += question.points;
        }
      } else {
        if (parseInt(userAnswer) === question.correctAnswer) {
          correctCount++;
          earnedPoints += question.points;
        }
      }
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    let rank = "Needs Improvement";
    if (percentage >= 90) rank = "Excellent";
    else if (percentage >= 80) rank = "Good";
    else if (percentage >= 70) rank = "Average";

    return {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      totalPoints,
      earnedPoints,
      percentage,
      timeSpent: formatTime(timeElapsed),
      rank,
    };
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const results = quizCompleted ? calculateResults() : null;

  const renderQuestion = (question) => {
    const userAnswer = answers[question.id];

    switch (question.type) {
      case "multiple-choice":
      case "scenario":
        return (
          <div className="space-y-4">
            {question.scenario && (
              <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-medium mb-2">Scenario:</p>
                <p className="text-sm">{question.scenario}</p>
              </div>
            )}
            <RadioGroup
              value={userAnswer || ""}
              onValueChange={(value) => handleAnswer(question.id, value)}
            >
              {question.options?.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "true-false":
        return (
          <RadioGroup
            value={userAnswer || ""}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            {question.options?.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 p-4 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <RadioGroupItem value={index.toString()} id={`tf-${index}`} />
                <Label
                  htmlFor={`tf-${index}`}
                  className="flex-1 cursor-pointer font-medium"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "fill-blank":
        return (
          <div className="space-y-4">
            <Input
              placeholder="Enter your answer..."
              value={userAnswer || ""}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className="text-lg p-4"
            />
            <p className="text-sm text-muted-foreground">
              Type your answer in the field above. Spelling and case don't
              matter.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Intermediate":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Advanced":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  // --- render states (start, results, quiz in progress) ---
  // [omitted here for brevity, but unchanged from your TSX]

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <CardTitle className="text-2xl mb-2">{quizData.title}</CardTitle>
                <p className="text-muted-foreground">{quizData.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{questions.length}</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{formatTime(quizData.timeLimit)}</div>
                    <div className="text-sm text-muted-foreground">Time Limit</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{quizData.totalPoints}</div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{quizData.passingScore}%</div>
                    <div className="text-sm text-muted-foreground">Passing Score</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Badge className={getDifficultyColor(quizData.difficulty)}>
                    {quizData.difficulty}
                  </Badge>
                  <Badge variant="outline">{quizData.category}</Badge>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Instructions:</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Read each question carefully before answering</li>
                    <li>• You can navigate back to previous questions to change answers</li>
                    <li>• Your progress is automatically saved</li>
                    <li>• Make sure to submit your quiz before the time limit</li>
                  </ul>
                </div>

                <Button 
                  onClick={() => setQuizStarted(true)}
                  size="lg" 
                  className="w-full"
                >
                  Start Quiz
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">
                  {results.percentage >= 90 ? '🏆' : results.percentage >= 70 ? '🎉' : '📚'}
                </div>
                <CardTitle className="text-2xl mb-2">Quiz Complete!</CardTitle>
                <Badge className={getDifficultyColor(results.rank)}>
                  {results.rank}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {results.percentage}%
                  </div>
                  <p className="text-muted-foreground">
                    You scored {results.earnedPoints} out of {results.totalPoints} points
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
                      <span className="text-lg font-bold">{results.correctAnswers}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <XCircle className="w-5 h-5 text-red-500 mr-1" />
                      <span className="text-lg font-bold">{results.totalQuestions - results.correctAnswers}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Incorrect</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-primary mr-2" />
                    <span className="text-lg font-bold">{results.timeSpent}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Time Spent</div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => navigate(`/category/${searchParams.get('category') || 'network-security'}`)}
                    variant="outline"
                    className="flex-1"
                  >
                    Back to Category
                  </Button>
                  <Button 
                    onClick={() => {
                      setQuizStarted(false);
                      setQuizCompleted(false);
                      setShowResults(false);
                      setCurrentQuestionIndex(0);
                      setAnswers({});
                      setTimeElapsed(0);
                    }}
                    className="flex-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quiz Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{quizData.title}</h1>
                <p className="text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatTime(timeElapsed)}
                </div>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
              </div>
            </div>
            
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg leading-relaxed">
                  {currentQuestion.question}
                </CardTitle>
                <div className="text-sm text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                  {currentQuestion.points} pts
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderQuestion(currentQuestion)}
              
              {showExplanation && (
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="text-blue-500 mt-1">💡</div>
                    <div>
                      <div className="font-medium text-blue-500 mb-1">Explanation:</div>
                      <p className="text-sm">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              {answers[currentQuestion.id] && !showExplanation && (
                <Button
                  variant="outline"
                  onClick={() => setShowExplanation(true)}
                >
                  Show Explanation
                </Button>
              )}
              
              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(answers).length < questions.length}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Question Navigator */}
          <div className="mt-8 p-4 bg-card rounded-lg border">
            <div className="text-sm font-medium mb-3">Question Progress:</div>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-primary text-primary-foreground'
                      : answers[questions[index].id]
                      ? 'bg-green-500 text-white'
                      : 'bg-muted hover:bg-muted/70'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
