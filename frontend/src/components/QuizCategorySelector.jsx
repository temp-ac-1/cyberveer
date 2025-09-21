import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Shield,
  Code,
  Network,
  Lock,
  Target,
  ChevronRight,
  Award,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSelector } from 'react-redux';

const QuizCategorySelector = () => {
  const navigate = useNavigate();
  const categories = useSelector((state) => state.category.categories);

  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case 'javascript-basics':
        return <Code className="w-8 h-8" />;
      case 'social-engineering':
        return <Shield className="w-8 h-8" />;
      case 'network-security':
        return <Network className="w-8 h-8" />;
      case 'cryptography':
        return <Lock className="w-8 h-8" />;
      default:
        return <BookOpen className="w-8 h-8" />;
    }
  };

  const QuizTypeSelection = (categoryId) => {
    navigate(`/quiz/category/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Choose Your Quiz Topic</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select a category to start testing your knowledge with interactive quizzes
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Object.values(categories).map((category) => (
              <Card
                key={category._id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30"
                onClick={() => QuizTypeSelection(category.slug)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                      {getCategoryIcon(category._id)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {category.title}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {category.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {category.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {category.totalLessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        Multiple quiz types
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                    onClick={() => QuizTypeSelection(category.slug)}
                  >
                    Start Quiz
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCategorySelector;
