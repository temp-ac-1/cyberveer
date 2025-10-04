import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckSquare,
  ToggleLeft,
  Edit3,
  FileText,
  Code,
  Clock,
  Target,
  Award,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";

const QuizTypeSelection = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.category.categories);

  const category = categoryId
    ? categories.find((cat) => cat._id === categoryId)
    : null;

  const quizTypes = [
    {
      id: "1",
      name: "Multiple Choice Questions",
      description:
        "Test your knowledge with traditional multiple choice questions covering key concepts.",
      icon: <CheckSquare className="w-6 h-6" />,
      difficulty: "Beginner",
      questions: 15,
      timeEstimate: "12 min",
      points: 100,
      slug: "mcq",
    },
    {
      id: "2",
      name: "True or False",
      description:
        "Quick assessment of your understanding with true/false statements.",
      icon: <ToggleLeft className="w-6 h-6" />,
      difficulty: "Beginner",
      questions: 10,
      timeEstimate: "8 min",
      points: 75,
      slug: "true-false",
    },
    {
      id: "3",
      name: "Fill in the Blanks",
      description:
        "Complete sentences and definitions by filling in the missing words.",
      icon: <Edit3 className="w-6 h-6" />,
      difficulty: "Intermediate",
      questions: 12,
      timeEstimate: "10 min",
      points: 120,
      slug: "fill-blanks",
    },
    {
      id: "4",
      name: "Scenario Based",
      description: "Apply your knowledge to real-world scenarios and case studies.",
      icon: <FileText className="w-6 h-6" />,
      difficulty: "Intermediate",
      questions: 8,
      timeEstimate: "15 min",
      points: 150,
      slug: "scenario",
    },
    {
      id: "5",
      name: "Mixed Quiz",
      description:
        "A comprehensive quiz combining different question types for complete assessment.",
      icon: <Code className="w-6 h-6" />,
      difficulty: "Advanced",
      questions: 20,
      timeEstimate: "25 min",
      points: 200,
      slug: "mixed",
    },
  ];

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

  const handleQuizTypeSelect = (quizType) => {
    navigate(`/quiz/take/${categoryId}/${quizType.slug}`);
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <Button onClick={() => navigate("/quiz")}>Back to Quiz Selection</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/quiz")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>

            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">{category.title} Quiz</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
                {category.description}
              </p>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {category.difficulty}
              </Badge>
            </div>
          </div>

          {/* Quiz Types */}
          <div className="grid gap-6 md:grid-cols-2">
            {quizTypes.map((quizType) => (
              <Card
                key={quizType.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30"
                onClick={() => handleQuizTypeSelect(quizType)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                        {quizType.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {quizType.name}
                        </CardTitle>
                        <Badge className={getDifficultyColor(quizType.difficulty)}>
                          {quizType.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{quizType.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4" />
                      <span>{quizType.questions} questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{quizType.timeEstimate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>{quizType.points} points</span>
                    </div>
                  </div>

                  <Button
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => handleQuizTypeSelect(quizType)}
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

export default QuizTypeSelection;
