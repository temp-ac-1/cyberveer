import React, { useState, useEffect, useRef } from 'react';
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
import { useGetQuizzes } from '@/hooks/useGetQuizzes';

const Quiz = () => {
  const { categoryId, quizType } = useParams();
  const navigate = useNavigate();
  const categories = useSelector(state => state.category.categories);
  const { currentQuiz, loading, error, submissionResult, fetchQuizByCategoryAndType, submitQuiz, clearSubmission , submitQuizSuccess} = useGetQuizzes();

  // Normalize inputs and defensively resolve category from state (works if categories is array or object)
  const normalizeQuizType = (qt) => {
    if (!qt) return '';
    const map = {
      'mcq-quiz': 'mcq',
      'mcq': 'mcq',
      'true-false-quiz': 'true-false',
      'true-false': 'true-false',
      'fill-blanks-quiz': 'fill-blanks',
      'fill-blanks': 'fill-blanks',
      'fill-blank': 'fill-blanks',
      'scenario-quiz': 'scenario',
      'scenario': 'scenario',
      'practical-quiz': 'mixed',
      'mixed': 'mixed'
    };
    return map[qt] ?? qt;
  };

  // Find category in many possible shapes (object keyed by id/slug or array)
  let category = null;
  if (categories) {
    if (Array.isArray(categories)) {
      category = categories.find(c => {
        return c?.slug === categoryId || c?._id === categoryId || c?.id === categoryId;
      });
    } else {
      // object or dictionary
      category = categories[categoryId] || Object.values(categories).find(c => c?.slug === categoryId || c?._id === categoryId || c?.id === categoryId);
    }
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  // Fetch quiz data when component mounts
  useEffect(() => {
    if (categoryId && quizType) {
      const normalizedQuizType = normalizeQuizType(quizType);
      // Reset all state
      clearSubmission();
      setQuizStarted(false);
      setQuizCompleted(false);
      setShowResults(false);
      setSubmitting(false);
      setQuizResults(null);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimeElapsed(0);
      fetchQuizByCategoryAndType(categoryId, normalizedQuizType);
    }
  }, [categoryId, quizType]);

  // Handle quiz submission result - SIMPLE AND BULLETPROOF
  useEffect(() => {
    if (submissionResult && submitting) {
      // Backend returned results, show them immediately
      setQuizResults(submissionResult);
      setQuizCompleted(true);
      setShowResults(true);
      setSubmitting(false);
    }
  }, [submissionResult, submitting]);

  // BULLETPROOF: Show results immediately when submissionResult exists
  useEffect(() => {
    if (submissionResult && !quizResults) {
      // console.log('BULLETPROOF: Setting results from submissionResult');
      setQuizResults(submissionResult);
      setQuizCompleted(true);
      setShowResults(true);
    }
  }, [submissionResult, quizResults]);

  // Get quiz data from backend
  const quizData = currentQuiz;
  const questions = currentQuiz?.questions || [];

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

  const handleSubmitQuiz = async () => {
    if (!quizData) {
      console.error('Missing quiz data');
      return;
    }

    // console.log('SUBMITTING QUIZ - Answers:', answers);
    setSubmitting(true);
    
    try {
      await submitQuiz(quizData.id, answers);
      // console.log('QUIZ SUBMITTED SUCCESSFULLY');
    } catch (error) {
      console.error('QUIZ SUBMISSION FAILED:', error);
      setSubmitting(false);
    }
  };

  const calculateResults = () => {
    if (quizResults) {
      const results = {
        ...quizResults,
        timeSpent: formatTime(timeElapsed)
      };
      return results;
    }
    return null;
  };

  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'advanced':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Loading Quiz...</h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Quiz</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/quiz')}>
              Back to Quiz Selection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Guard: if no quiz data available, show explanatory message and back button
  if (!quizData || !questions.length) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
            <p className="text-muted-foreground mb-4">No quiz available for this category and type.</p>
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
                <p className="text-muted-foreground">{quizData.description || 'Test your knowledge with this quiz.'}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{questions.length}</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{formatTime((quizData.timeLimit || 60) * 60)}</div>
                    <div className="text-sm text-muted-foreground">Time Limit</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{quizData.totalPoints || questions.reduce((sum, q) => sum + (q.points || 5), 0)}</div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{quizData.passingScore || 70}%</div>
                    <div className="text-sm text-muted-foreground">Passing Score</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Badge className={getDifficultyColor(quizData.difficulty)}>
                    {quizData.difficulty?.charAt(0).toUpperCase() + quizData.difficulty?.slice(1) || 'Medium'}
                  </Badge>
                  <Badge variant="outline">{quizData.category?.name || category?.title || 'Quiz'}</Badge>
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
                  onClick={() => {
                    if (questions.length === 0) {
                      window.alert('No questions are available for this quiz. Please try another quiz.');
                      navigate(`/quiz/category/${categoryId}`);
                      return;
                    }
                    setQuizStarted(true);
                  }}
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

  // Results computation - SIMPLE AND BULLETPROOF
  const displayResults = quizResults || submissionResult;
  
  // Debug logging
  // console.log('CURRENT STATE:', {
  //   quizCompleted,
  //   showResults,
  //   quizResults: !!quizResults,
  //   submissionResult: !!submissionResult,
  //   displayResults: !!displayResults,
  //   submitting
  // });

  // Show results if we have them, regardless of other state
  if (displayResults) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header */}
            <Card className="mb-8">
              <CardHeader className="text-center">
                <div className="text-6xl mb-4">
                  {displayResults.percentage >= 90 ? '🏆' : displayResults.percentage >= 70 ? '🎉' : '📚'}
                </div>
                <CardTitle className="text-3xl mb-2">Quiz Complete!</CardTitle>
                <Badge className={getDifficultyColor(displayResults.rank)} variant="outline">
                  {displayResults.rank}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {displayResults.percentage}%
                  </div>
                  <p className="text-muted-foreground text-lg">
                    You scored {displayResults.earnedPoints} out of {displayResults.totalPoints} points
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
                      <span className="text-xl font-bold">{displayResults.correctAnswers}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Correct</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <XCircle className="w-5 h-5 text-red-500 mr-1" />
                      <span className="text-xl font-bold">{displayResults.totalQuestions - displayResults.correctAnswers}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Incorrect</div>
                  </div>
                  <div className="text-center p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="w-5 h-5 text-primary mr-2" />
                      <span className="text-xl font-bold">{displayResults.timeSpent || formatTime(timeElapsed)}</span>
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
                      clearSubmission();
                      setQuizStarted(false);
                      setQuizCompleted(false);
                      setShowResults(false);
                      setSubmitting(false);
                      setQuizResults(null);
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
                {(displayResults.questionResults || []).map((result, index) => (
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
                    {index < (displayResults.questionResults || []).length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Guard currentQuestion safely
  const currentQuestion = questions && questions.length > 0 ? questions[currentQuestionIndex] : null;
  const progress = questions && questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // If we somehow got here but there are zero questions — show a fallback
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Card>
              <CardHeader>
                <CardTitle>No questions available</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">There are no questions for this category & quiz type. Please choose a different type or category.</p>
                <div className="flex justify-center gap-2">
                  <Button onClick={() => navigate(`/quiz/category/${categoryId}`)} variant="outline">Back</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const renderQuestion = (question) => {
    const userAnswer = answers[question.id];

    switch (question.type) {
      case 'mcq':
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

      case 'true_false':
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

      case 'fill_blank':
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
                <Button onClick={handleSubmitQuiz} size="lg" disabled={submitting}>
                  <Flag className="w-4 h-4 mr-2" />
                  {submitting ? 'Submitting...' : 'Submit Quiz'}
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