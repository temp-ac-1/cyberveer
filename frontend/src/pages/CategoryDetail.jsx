import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  Clock,
  Users,
  Star,
  Target,
  BookOpen,
  FileText,
  Zap,
  Trophy,
  CheckCircle,
  Circle,
  Award,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LessonReader from "@/components/LessonReader";
import QuizTypeSelector from "@/components/QuizTypeSelector";
import { useDispatch, useSelector } from "react-redux";
import useGetSubcategories from "@/hooks/useGetSubcategories";

const CategoryDetail = () => {
  const { slug } = useParams();
  useGetSubcategories(slug);

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showQuizSelector, setShowQuizSelector] = useState(false);
  const [openedSection, setOpenedSection] = useState(null);

  // Get data from Redux store
  const subCategoryData = useSelector(
    (store) => store.subcategory.subcategories
  );
  
  const categories = useSelector((store) => store.category.categories);
  // const achievements = useSelector(state => state.userProgress.achievements);
  const achievements = [
    {
      id: 1,
      earned: true,
      icon: "✒",
      title: "master",
      description: "noting",
      progress: 4,
      maxProgress: 12,
    },
  ];

  const categoryData = categories.filter((category) => {
    return category.slug === slug;
  });
  if (!subCategoryData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Category not found
            </h1>
            <Link to="/categories" className="text-primary hover:underline">
              Back to Categories
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  

  const handleTogglesubcategory = (subcategoryId) => {
    setOpenedSection(subcategoryId);
  };

  const openLessonReader = (lesson) => {
    setSelectedLesson({
      id: lesson._id,
      title: lesson.title,
    });
  };

  const closeLessonReader = () => {
    setSelectedLesson(null);
  };

  const openQuizSelector = () => {
    setShowQuizSelector(true);
  };

  const closeQuizSelector = () => {
    setShowQuizSelector(false);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link
              to="/categories"
              className="text-muted-foreground hover:text-foreground"
            >
              Categories
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">
              {categoryData[0].title}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero subcategory */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 p-8">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-4xl">{categoryData[0].icon}</div>
                      <Badge
                        className={getDifficultyColor(
                          categoryData[0].difficulty
                        )}
                      >
                        {categoryData[0].difficulty}
                      </Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-3">
                      {categoryData[0].title}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-6">
                      {categoryData[0].description}
                    </p>
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">2h</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          222 learners
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-muted-foreground">4.3/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      Progress
                    </span>
                    <span className="text-sm text-muted-foreground">
                      2/4 lessons
                    </span>
                  </div>
                  <Progress value={79} className="h-3" />
                </div>
              </div>
            </Card>

            {/* Learning Path */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Learning Path
                </CardTitle>
                <CardDescription>
                  Follow the structured path to master {categoryData[0].title}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subCategoryData.map((subcategory, index) => (
                  <Collapsible
                    key={subcategory._id}
                    open={openedSection === subcategory._id}
                    onOpenChange={() =>
                      handleTogglesubcategory(subcategory._id)
                    }
                  >
                    <CollapsibleTrigger className="w-full">
                      <Card className="transition-all duration-200 hover:shadow-md">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-medium">
                                {index + 1}
                              </div>
                              <div className="text-left">
                                <h3 className="font-semibold text-foreground">
                                  {subcategory.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {subcategory.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm font-medium text-foreground">
                                  {/* {subcategory.completedLessons + subcategory.completedQuizzes}/
                                  {subcategory.totalLessons + subcategory.totalQuizzes} */}
                                  4/12
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Completed
                                </div>
                              </div>
                              <ChevronRight
                                className={`w-4 h-4 transition-transform ${
                                  openedSection === subcategory._id
                                    ? "rotate-90"
                                    : ""
                                }`}
                              />
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="pl-12 pr-4 pb-4 space-y-3">
                        {/* Lessons */}
                        {subcategory.lessons.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              Lessons ({subcategory.lessons.length})
                            </h4>
                            {subcategory.lessons.map((lesson) => (
                              <div
                                key={lesson._id}
                                className="flex items-center justify-between p-3 bg-card/50 rounded-lg border"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                                  <span className="text-sm text-foreground">
                                    {lesson.title}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Circle className="w-4 h-4 text-muted-foreground" />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      openLessonReader(lesson)
                                    }
                                  >
                                    Start
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quizzes */}
                        {subcategory.quizzes.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Quizzes ({subcategory.quizzes.length})
                            </h4>
                            {subcategory.quizzes.map((quizId) => (
                              <div
                                key={quizId}
                                className="flex items-center justify-between p-3 bg-card/50 rounded-lg border"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                                  <span className="text-sm text-foreground">
                                    Quiz {quizId}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Circle className="w-4 h-4 text-muted-foreground" />
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={openQuizSelector}
                                  >
                                    <Play className="w-4 h-4 mr-1" />
                                    Take Quiz
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      achievement.earned
                        ? "bg-primary/5 border-primary/20"
                        : "bg-muted/20 border-border"
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground">
                        {achievement.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {achievement.description}
                      </p>
                      {!achievement.earned && (
                        <div className="mt-1">
                          <Progress
                            value={
                              (achievement.progress / achievement.maxProgress) *
                              100
                            }
                            className="h-1"
                          />
                        </div>
                      )}
                    </div>
                    {achievement.earned && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={openQuizSelector}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Take Custom Quiz
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Leaderboard
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Award className="w-4 h-4 mr-2" />
                  Certificate Progress
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Study Groups
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />

      {/* Lesson Reader Modal */}
      {selectedLesson && (
        <LessonReader
          lessonId={selectedLesson.id}
          lessonTitle={selectedLesson.title}
          onClose={closeLessonReader}
        />
      )}

      {/* Quiz Type Selector Modal */}
      {showQuizSelector && (
        <QuizTypeSelector
          categorySlug={slug || ""}
          onClose={closeQuizSelector}
        />
      )}
    </div>
  );
};

export default CategoryDetail;
