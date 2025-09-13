import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  CheckCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDispatch, useSelector } from "react-redux";
import useGetLessons from "@/hooks/useGetLessons";
// import { completeLesson, markLessonCompleted } from "@/store/lessonsSlice"; // ⬅️ uncomment if you have actions

const LessonReader = ({ lessonId, onClose }) => {
  const dispatch = useDispatch();

  // 🔹 fetch lessons on mount
  useGetLessons(lessonId);

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // 🔹 get lessons from redux
  const lessons = useSelector((state) => state.lessons.lessonsBySubCategory);

  // 🔹 pick current lesson
  const currentLesson = lessons?.[currentLessonIndex];

  // 🔹 progress calculation
  const completedLessons =
    lessons?.filter((lesson) => lesson?.completed).length || 0;
  const progressPercentage =
    lessons?.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  // 🔹 pagination logic
  const WORDS_PER_PAGE = 400;
  const pages = useMemo(() => {
    if (!currentLesson?.content) return [];
    const words = currentLesson.content.split(" ");
    const pagesArray = [];
    for (let i = 0; i < words.length; i += WORDS_PER_PAGE) {
      pagesArray.push(words.slice(i, i + WORDS_PER_PAGE).join(" "));
    }
    return pagesArray;
  }, [currentLesson?.content]);

  const totalPages = pages.length;

  // 🔹 page navigation
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((p) => p + 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((p) => p - 1);
        setIsFlipping(false);
      }, 300);
    }
  };

  // 🔹 lesson navigation
  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentLessonIndex((i) => i + 1);
        setCurrentPage(0);
        setIsFlipping(false);
      }, 300);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentLessonIndex((i) => i - 1);
        setCurrentPage(0);
        setIsFlipping(false);
      }, 300);
    }
  };

  // 🔹 mark complete
  const handleCompleteLesson = () => {
    if (currentLesson && !currentLesson.completed) {
      // dispatch(completeLesson(currentLesson.id));
      // dispatch(markLessonCompleted(currentLesson.id));
      console.log("Marking lesson complete:", currentLesson.id);
    }
  };

  // 🔹 difficulty badge color
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

  // 🔹 handle loading / empty state
  if (!lessons || lessons.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading lessons...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl h-[80vh] perspective-1000">
        <div
          className={`relative w-full h-full transition-transform duration-300 ease-in-out ${
            isFlipping ? "book-flip" : ""
          }`}
        >
          <Card className="w-full h-full flex flex-col overflow-hidden shadow-2xl book-shadow">
            {/* Header */}
            <CardHeader className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Category
                  </Button>
                  <div>
                    <CardTitle className="text-lg">
                      {currentLesson?.sectionTitle || "Lesson Section"}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        className={getDifficultyColor(currentLesson.difficulty)}
                      >
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

            {/* Content */}
            <CardContent className="flex-1 overflow-y-auto p-8 bg-gradient-to-br from-background to-background/95 min-h-0">
              <div className="max-w-none min-h-[400px]">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <BookOpen className="w-8 h-8" />
                  {currentLesson.title}
                  {currentLesson.completed && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </h1>

                <div className="prose prose-lg prose-slate dark:prose-invert max-w-none leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {pages[currentPage] || currentLesson.content}
                  </ReactMarkdown>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages - 1}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>

            {/* Footer */}
            <div className="border-t p-4 bg-background/95 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousLesson}
                  disabled={currentLessonIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous Lesson
                </Button>

                <div className="flex items-center gap-2">
                  {!currentLesson.completed && (
                    <Button onClick={handleCompleteLesson}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Complete
                    </Button>
                  )}

                  <Button
                    onClick={handleNextLesson}
                    disabled={currentLessonIndex === lessons.length - 1}
                  >
                    Next Lesson
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonReader;
