import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  ToggleLeft, 
  Edit3, 
  FileText, 
  Code, 
  Clock,
  Target,
  Award,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const QuizTypeSelector = ({ categorySlug, onClose }) => {
  const quizTypes = [
    {
      id: '1',
      name: 'Multiple Choice Questions',
      description: 'Test your knowledge with traditional multiple choice questions covering key concepts.',
      icon: <CheckSquare className="w-6 h-6" />,
      difficulty: 'Beginner',
      questions: 20,
      timeEstimate: '10 min',
      points: 100,
      slug: 'mcq-quiz'
    },
    {
      id: '2',
      name: 'True or False',
      description: 'Quick assessment of your understanding with true/false statements.',
      icon: <ToggleLeft className="w-6 h-6" />,
      difficulty: 'Beginner',
      questions: 15,
      timeEstimate: '5 min',
      points: 75,
      slug: 'true-false-quiz'
    },
    {
      id: '3',
      name: 'Fill in the Blanks',
      description: 'Complete sentences and definitions by filling in the missing words.',
      icon: <Edit3 className="w-6 h-6" />,
      difficulty: 'Intermediate',
      questions: 12,
      timeEstimate: '8 min',
      points: 120,
      slug: 'fill-blanks-quiz'
    },
    {
      id: '4',
      name: 'Scenario Based',
      description: 'Apply your knowledge to real-world cybersecurity scenarios and case studies.',
      icon: <FileText className="w-6 h-6" />,
      difficulty: 'Intermediate',
      questions: 10,
      timeEstimate: '15 min',
      points: 150,
      slug: 'scenario-quiz'
    },
    {
      id: '5',
      name: 'Practical Labs',
      description: 'Hands-on practical exercises simulating real cybersecurity tasks.',
      icon: <Code className="w-6 h-6" />,
      difficulty: 'Advanced',
      questions: 8,
      timeEstimate: '25 min',
      points: 200,
      slug: 'practical-quiz'
    }
  ];

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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Choose Quiz Type
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
          <p className="text-muted-foreground">
            Select the type of quiz you'd like to take to test your knowledge in different ways.
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            {quizTypes.map((quizType) => (
              <Card 
                key={quizType.id} 
                className="h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {quizType.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {quizType.name}
                        </CardTitle>
                        <Badge className={getDifficultyColor(quizType.difficulty)}>
                          {quizType.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4">
                    {quizType.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <CheckSquare className="w-4 h-4" />
                      {quizType.questions} questions
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {quizType.timeEstimate}
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {quizType.points} points
                    </div>
                  </div>

                  <Link to={`/quiz/${categorySlug}/${quizType.slug}`}>
                    <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Start Quiz
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizTypeSelector;
