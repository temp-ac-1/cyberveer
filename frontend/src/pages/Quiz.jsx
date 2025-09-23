import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Flag, 
  RotateCcw,
  CheckCircle,
  XCircle,
  Award,
  Target,
  ArrowLeft,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import { useSelector } from 'react-redux';


const Quiz = () => {
  const { categoryId, quizType } = useParams();
  const navigate = useNavigate();
  const categories = useSelector(state => state.category.categories);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const category = categoryId ? categories[categoryId] : null;

  // Generate quiz data based on category and type
  const getQuizData = () => {
    if (!category || !quizType) return null;
    
    const quizTypeNames = {
      'mcq': 'Multiple Choice Quiz',
      'true-false': 'True or False Quiz',
      'fill-blanks': 'Fill in the Blanks Quiz',
      'scenario': 'Scenario Based Quiz',
      'mixed': 'Mixed Quiz'
    };

    return {
      id: `${categoryId}-${quizType}`,
      title: `${category.title} - ${quizTypeNames}`,
      description: `Test your knowledge of ${category.title.toLowerCase()} concepts.`,
      difficulty: category.difficulty,
      category: category.title,
      timeLimit: quizType === 'mixed' ? 1500 : 900, // 25 min for mixed, 15 min for others
      totalPoints: quizType === 'mixed' ? 200 : 100,
      passingScore: 70
    };
  };

  const quizData = getQuizData();

  // Generate questions based on category and quiz type
  const generateQuestions = () => {
    if (!categoryId || !quizType) return [];

    const baseQuestions = [
      // JavaScript questions
      ...(categoryId === 'javascript-basics' ? [
        {
          id: '1',
          type: 'multiple-choice',
          question: 'Which of the following is NOT a primitive data type in JavaScript?',
          options: ['string', 'number', 'object', 'boolean'],
          correctAnswer: 2,
          explanation: 'Object is not a primitive data type in JavaScript. The primitive types are: string, number, boolean, undefined, null, symbol, and bigint.',
          difficulty: 'Beginner',
          points: 10
        },
        {
          id: '2',
          type: 'true-false',
          question: 'JavaScript is a statically typed language.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. JavaScript is a dynamically typed language, meaning variable types are determined at runtime.',
          difficulty: 'Beginner',
          points: 5
        },
        {
          id: '3',
          type: 'fill-blank',
          question: 'The _______ operator is used to check both value and type equality in JavaScript.',
          correctAnswer: '===',
          explanation: 'The strict equality operator (===) checks both value and type, while == only checks value with type coercion.',
          difficulty: 'Intermediate',
          points: 15
        },
        {
          id: '4',
          type: 'scenario',
          scenario: 'You are debugging a JavaScript function that sometimes returns unexpected results when comparing values.',
          question: 'Which comparison operator should you use to avoid type coercion issues?',
          options: ['==', '===', '!=', 'typeof'],
          correctAnswer: 1,
          explanation: 'The strict equality operator (===) should be used to avoid type coercion issues, as it compares both value and type.',
          difficulty: 'Intermediate',
          points: 20
        }
      ] : []),
      // Social engineering questions
      ...(categoryId === 'social-engineering' ? [
        {
          id: '1',
          type: 'multiple-choice',
          question: 'What is the primary goal of social engineering attacks?',
          options: ['Damage hardware', 'Manipulate people to divulge information', 'Install malware', 'Break encryption'],
          correctAnswer: 1,
          explanation: 'Social engineering primarily focuses on manipulating people psychologically to reveal confidential information or perform actions that compromise security.',
          difficulty: 'Beginner',
          points: 10
        },
        {
          id: '2',
          type: 'scenario',
          scenario: 'You receive a phone call from someone claiming to be from IT support, asking for your password to "fix an urgent security issue".',
          question: 'What should you do?',
          options: ['Give them your password immediately', 'Hang up and contact IT through official channels', 'Ask them to call back later', 'Give them a fake password'],
          correctAnswer: 1,
          explanation: 'Never give passwords over the phone. Always verify the caller through official channels before providing any sensitive information.',
          difficulty: 'Intermediate',
          points: 20
        },
        {
          id: '3',
          type: 'true-false',
          question: 'Phishing attacks only happen through email.',
          options: ['True', 'False'],
          correctAnswer: 1,
          explanation: 'False. Phishing can occur through various channels including SMS (smishing), phone calls (vishing), social media, and malicious websites.',
          difficulty: 'Beginner',
          points: 5
        },
        {
          id: '4',
          type: 'fill-blank',
          question: 'A _______ attack involves tricking someone into revealing confidential information by pretending to be a trustworthy entity.',
          correctAnswer: 'phishing',
          explanation: 'Phishing is a social engineering attack where attackers impersonate legitimate organizations to steal sensitive information.',
          difficulty: 'Intermediate',
          points: 15
        }
      ] : [])
    ];

    // Filter questions based on quiz type
    let questions = baseQuestions;
    if (quizType !== 'mixed') {
      questions = questions.filter(q => {
        if (quizType === 'mcq') return q.type === 'multiple-choice';
        if (quizType === 'true-false') return q.type === 'true-false';
        if (quizType === 'fill-blanks') return q.type === 'fill-blank';
        if (quizType === 'scenario') return q.type === 'scenario';
        return true;
      });
    }

    // Add more questions if needed to meet minimum count
    const minQuestions = quizType === 'mixed' ? 15 : Math.max(questions.length, 8);
    while (questions.length < minQuestions) {
      questions = [...questions, ...questions.slice(0, Math.min(questions.length, minQuestions - questions.length))];
    }

    return questions.slice(0, minQuestions).map((q, index) => ({
      ...q,
      id: `${categoryId}-${quizType}-${index + 1}`
    }));
  };

  const questions = generateQuestions();

  // Timer effect
  useEffect(() => {
    let interval;
    if (quizStarted && !quizCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, quizCompleted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
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
    const questionResults = [];

    questions.forEach((question) => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      let isCorrect = false;
      
      if (question.type === 'fill-blank') {
        isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer.toString().toLowerCase();
      } else {
        isCorrect = parseInt(userAnswer) === question.correctAnswer;
      }

      if (isCorrect) {
        correctCount++;
        earnedPoints += question.points;
      }

      questionResults.push({
        question,
        userAnswer: userAnswer || 'No answer',
        isCorrect
      });
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    let rank = 'Needs Improvement';
    if (percentage >= 90) rank = 'Excellent';
    else if (percentage >= 80) rank = 'Good';
    else if (percentage >= 70) rank = 'Average';

    return {
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      totalPoints,
      earnedPoints,
      percentage,
      timeSpent: formatTime(timeElapsed),
      rank,
      questionResults
    };
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const results = quizCompleted ? calculateResults() : null;

  const renderQuestion = (question) => {
    const userAnswer = answers[question.id];

    switch (question.type) {
      case 'multiple-choice':
      case 'scenario':
        return (
          <div className="space-y-4">
            {question.scenario && (
              <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-medium mb-2">Scenario:</p>
                <p className="text-sm">{question.scenario}</p>
              </div>
            )}
            <RadioGroup
              value={userAnswer || ''}
              onValueChange={(value) => handleAnswer(question.id, value)}
            >
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/30 transition-colors">
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

      case 'true-false':
        return (
          <RadioGroup
            value={userAnswer || ''}
            onValueChange={(value) => handleAnswer(question.id, value)}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-4 rounded-lg hover:bg-muted/30 transition-colors">
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

      case 'fill-blank':
        return (
          <div className="space-y-4">
            <Input
              placeholder="Enter your answer..."
              value={userAnswer || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className="text-lg p-4"
            />
            <p className="text-sm text-muted-foreground">
              Type your answer in the field above. Spelling and case don't matter.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Intermediate':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Advanced':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  if (!category || !quizData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
            <Button onClick={() => navigate('/quiz')}>
              Back to Quiz Selection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/quiz/category/${categoryId}`)}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quiz Types
            </Button>

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
                    <li>• Submit your quiz when you're ready - no time pressure!</li>
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
            {/* Results Header */}
            <Card className="mb-8">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">
                  {results.percentage >= 90 ? '🏆' : results.percentage >= 70 ? '🎉' : '📚'}
                </div>
                <CardTitle className="text-3xl mb-2">Quiz Complete!</CardTitle>
                <Badge className={getDifficultyColor(results.rank)} variant="outline">
                  {results.rank}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {results.percentage}%
                  </div>
                  <p className="text-muted-foreground text-lg">
                    You scored {results.earnedPoints} out of {results.totalPoints} points
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
                      <span className="text-xl font-bold">{results.correctAnswers}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <XCircle className="w-5 h-5 text-red-500 mr-1" />
                      <span className="text-xl font-bold">{results.totalQuestions - results.correctAnswers}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Incorrect</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="w-5 h-5 text-primary mr-2" />
                      <span className="text-xl font-bold">{results.timeSpent}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Time Spent</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => navigate(`/quiz/category/${categoryId}`)}
                    variant="outline"
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Quiz Types
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

            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Question Review
                </CardTitle>
                <p className="text-muted-foreground">
                  Review all questions with correct answers and explanations
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {results.questionResults.map((result, index) => (
                  <div key={result.question.id} className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        result.isCorrect ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {result.isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">Question {index + 1}</h3>
                          <Badge className={getDifficultyColor(result.question.difficulty)} variant="outline">
                            {result.question.difficulty}
                          </Badge>
                          <Badge variant="secondary">{result.question.points} pts</Badge>
                        </div>
                        
                        {result.question.scenario && (
                          <div className="p-3 bg-muted/50 rounded-lg border-l-4 border-primary mb-3">
                            <p className="text-sm font-medium mb-1">Scenario:</p>
                            <p className="text-sm">{result.question.scenario}</p>
                          </div>
                        )}
                        
                        <p className="font-medium mb-3">{result.question.question}</p>
                        
                        {result.question.options && (
                          <div className="space-y-2 mb-3">
                            {result.question.options.map((option, optionIndex) => (
                              <div 
                                key={optionIndex}
                                className={`p-2 rounded border text-sm ${
                                  optionIndex === result.question.correctAnswer
                                    ? 'bg-green-500/10 border-green-500/20 text-green-700'
                                    : optionIndex.toString() === result.userAnswer
                                    ? 'bg-red-500/10 border-red-500/20 text-red-700'
                                    : 'bg-muted/30 border-border'
                                }`}
                              >
                                <span className="inline-block w-6 h-6 rounded-full bg-background border mr-2 text-center text-xs leading-6">
                                  {String.fromCharCode(65 + optionIndex)}
                                </span>
                                {option}
                                {optionIndex === result.question.correctAnswer && (
                                  <span className="ml-2 text-green-500">✓ Correct</span>
                                )}
                                {optionIndex.toString() === result.userAnswer && optionIndex !== result.question.correctAnswer && (
                                  <span className="ml-2 text-red-500">✗ Your answer</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {result.question.type === 'fill-blank' && (
                          <div className="space-y-2 mb-3">
                            <div className="flex gap-4">
                              <div>
                                <span className="text-sm text-muted-foreground">Your answer:</span>
                                <div className={`inline-block ml-2 px-2 py-1 rounded border ${
                                  result.isCorrect ? 'bg-green-500/10 border-green-500/20 text-green-700' : 'bg-red-500/10 border-red-500/20 text-red-700'
                                }`}>
                                  {result.userAnswer}
                                </div>
                              </div>
                              <div>
                                <span className="text-sm text-muted-foreground">Correct answer:</span>
                                <div className="inline-block ml-2 px-2 py-1 rounded border bg-green-500/10 border-green-500/20 text-green-700">
                                  {result.question.correctAnswer}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div className="p-3 bg-blue-500/10 rounded-lg border-l-4 border-blue-500">
                          <p className="text-sm font-medium mb-1 text-blue-700">Explanation:</p>
                          <p className="text-sm text-blue-600">{result.question.explanation}</p>
                        </div>
                      </div>
                    </div>
                    {index < results.questionResults.length - 1 && <Separator />}
                  </div>
                ))}
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
          <div className="mb-8 flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/quiz/category/${categoryId}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quiz Types
            </Button>
            <div className="flex items-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              {formatTime(timeElapsed)}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{quizData.title}</h1>
                <p className="text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">{currentQuestion.points} pts</Badge>
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderQuestion(currentQuestion)}
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
              {currentQuestionIndex === questions.length - 1 ? (
                <Button onClick={handleSubmitQuiz} size="lg">
                  <Flag className="w-4 h-4 mr-2" />
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;