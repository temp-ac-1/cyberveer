import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

const LessonReader = ({
  sectionId,
  sectionTitle,
  lessons,
  onLessonComplete,
  onClose
}) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const currentLesson = lessons[currentLessonIndex];
  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = (completedLessons / lessons.length) * 100;

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleCompleteLesson = () => {
    if (!currentLesson.completed) {
      onLessonComplete(currentLesson.id);
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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Category
              </Button>
              <div>
                <CardTitle className="text-lg">{sectionTitle}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getDifficultyColor(currentLesson.difficulty)}>
                    {currentLesson.difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {currentLesson.estimatedTime}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Lesson {currentLessonIndex + 1} of {lessons.length}
              </div>
              <div className="text-sm font-medium">
                {completedLessons}/{lessons.length} Completed
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto p-6">
          <div className="max-w-none">
            <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {currentLesson.title}
              {currentLesson.completed && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </h1>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
            </div>
          </div>
        </CardContent>

        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentLessonIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {!currentLesson.completed && (
                <Button onClick={handleCompleteLesson}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Complete
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={currentLessonIndex === lessons.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LessonReader;
