import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  ChevronRight,
  Clock,
  Users,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useDispatch, useSelector } from "react-redux";
import useGetCategory from "@/hooks/useGetCategories"
import { setCategories } from "@/redux/categoriesSlice";

const Categories = () => {
  useGetCategory();
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");

  const dispatch = useDispatch();
  const { categories, loading } = useSelector((store)=>store.category);
  const filteredCategories = useMemo(() => {
    if (!categories) return [];

    let filtered = categories.filter((cat) => {
      const matchesSearch =
        cat.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty =
        difficultyFilter === "all" || cat.difficulty === difficultyFilter;

      return matchesSearch && matchesDifficulty;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.participants - a.participants;
        case "rating":
          return b.rating - a.rating;
        case "progress":
          return b.overallProgress - a.overallProgress;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [categories, searchQuery, difficultyFilter, sortBy]);

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

  const CategorySkeleton = () => (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-2 w-full mb-4" />
        <div className="flex items-center justify-between text-sm mb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-transparent bg-gradient-cyber bg-clip-text">
                Explore Categories
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master cybersecurity across multiple domains with our
              comprehensive learning paths and interactive quizzes.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-cyber"
                />
              </div>

              <div className="flex gap-4 items-center">
                <Select
                  value={difficultyFilter}
                  onValueChange={setDifficultyFilter}
                >
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="progress">Your Progress</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredCategories?.length} of {categories?.length} categories
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <CategorySkeleton key={index} />
                ))
              : filteredCategories.map((category) => (
                  <Card
                    key={category._id}
                    className="group h-full hover:shadow-glow transition-all duration-300 border-border/50 hover:border-primary/30 hover:scale-105"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-3xl">{category.avatar || "📁"}</div>
                        <Badge className={getDifficultyColor(category.difficulty)}>
                          {category.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {console.log(category)}
                        {category.title}
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {category.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{category.overallProgress}%</span>
                        </div>
                        <Progress value={category.overallProgress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          5 hours
                        </div>
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {category.participants.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 mr-1 fill-current text-yellow-500" />
                          {category.rating}
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        {category.completedQuizzes}/{category.totalQuizzes} quizzes completed
                      </div>

                      <Link to={`/category/${category.slug}`} className="block">
                        <Button className="w-full group-hover:shadow-glow">
                          Explore Now
                          <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
          </div>

          {/* Empty state */}
          {!loading && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No categories found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setDifficultyFilter("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
