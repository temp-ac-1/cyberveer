import { useState } from "react";
import { achievements } from "@/data/achievements";
import { demoQuizzes, categoryProgress } from "@/data/profileData";
import Navbar from "@/components/Navbar";
import { EditProfileDialog } from "@/components/EditProfileDialog";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme, themes } from "@/contexts/ThemeContext";
import {
  Edit,
  LogOut,
  Calendar,
  Trophy,
  Target,
  Zap,
  Settings,
  Award,
  Shield,
  TrendingUp,
  Clock,
  Star,
  Users,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { currentTheme, setTheme } = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const handleEditProfile = () => {
    setEditDialogOpen(true);
  };

  const ThemePreview = ({ themeName }) => {
    const theme = themes.find((t) => t.name === themeName);
    if (!theme) return null;

    return (
      <div
        className={`relative w-full h-20 rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${
          currentTheme === themeName
            ? "border-primary shadow-glow"
            : "border-border hover:border-primary/50"
        }`}
        onClick={() => setTheme(themeName)}
        data-theme={themeName}
        style={{
          background: `hsl(var(--color-background))`,
          color: `hsl(var(--color-foreground))`,
        }}
      >
        <div className="absolute inset-2 flex items-center justify-between">
          <div className="flex gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: `hsl(var(--color-primary))` }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: `hsl(var(--color-secondary))` }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: `hsl(var(--color-accent))` }}
            />
          </div>
          <span className="text-xs font-medium">{theme.icon}</span>
        </div>
        {currentTheme === themeName && (
          <div className="absolute -top-1 -right-1">
            <CheckCircle className="w-5 h-5 text-primary bg-background rounded-full" />
          </div>
        )}
      </div>
    );
  };
  const earnedAchievements = achievements.filter((a) => a.earned);
  const totalAchievementPoints = earnedAchievements.reduce(
    (sum, a) => sum + a.points,
    0
  );

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case "common":
        return "text-muted-foreground border-muted";
      case "rare":
        return "text-cyber-blue border-cyber-blue";
      case "epic":
        return "text-cyber-purple border-cyber-purple";
      case "legendary":
        return "text-cyber-orange border-cyber-orange";
      default:
        return "text-muted-foreground border-muted";
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-success";
    if (score >= 75) return "text-warning";
    return "text-destructive";
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Profile Header */}
          <Card className="card-cyber mb-8 animate-fade-in">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex items-start space-x-6">
                  <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                    <AvatarImage
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.username
                        )}&background=random`
                      }
                      alt="Profile"
                    />
                    <AvatarFallback className="text-lg font-bold bg-gradient-cyber text-primary-foreground">
                      {user.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-2">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">
                        {user.fullName}
                      </h1>
                      <p className="text-muted-foreground">@{user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {user.joinDate}</span>
                      {user.provider && (
                        <>
                          <span>•</span>
                          <span>Via {user.provider}</span>
                        </>
                      )}
                    </div>

                    <Badge className="bg-gradient-cyber text-primary-foreground border-0 hover:opacity-90">
                      <Shield className="h-3 w-3 mr-1" />
                      {user.level}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleEditProfile}
                    variant="outline"
                    className="gap-2 bg-card/50 border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="gap-2 bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors">
                  <Trophy className="h-6 w-6 mx-auto mb-2 text-cyber-orange" />
                  <div className="text-2xl font-bold text-foreground">
                    {user?.totalScore?.toLocaleString() || 1200}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Score
                  </div>
                </div>

                <div className="text-center p-4 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors">
                  <Target className="h-6 w-6 mx-auto mb-2 text-cyber-blue" />
                  <div className="text-2xl font-bold text-foreground">
                    {user.quizzesCompleted || 28}
                  </div>
                  <div className="text-sm text-muted-foreground">Quizzes</div>
                </div>

                <div className="text-center p-4 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors">
                  <TrendingUp className="h-6 w-6 mx-auto mb-2 text-success" />
                  <div className="text-2xl font-bold text-foreground">
                    {user.averageScore || 86}%
                  </div>
                  <div className="text-sm text-muted-foreground">Average</div>
                </div>

                <div className="text-center p-4 rounded-lg bg-card border border-border/50 hover:border-primary/50 transition-colors">
                  <Users className="h-6 w-6 mx-auto mb-2 text-cyber-purple" />
                  <div className="text-2xl font-bold text-foreground">
                    {user.rank || 13}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Global Rank
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5 bg-card/50 border border-border/50 p-1">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gradient-cyber data-[state=active]:text-primary-foreground"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="progress"
                className="data-[state=active]:bg-gradient-cyber data-[state=active]:text-primary-foreground"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Progress
              </TabsTrigger>
              <TabsTrigger
                value="badges"
                className="data-[state=active]:bg-gradient-cyber data-[state=active]:text-primary-foreground"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Badges
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:bg-gradient-cyber data-[state=active]:text-primary-foreground"
              >
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-gradient-cyber data-[state=active]:text-primary-foreground"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Quiz Results */}
                <Card className="card-cyber">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Recent Results
                    </CardTitle>
                    <CardDescription>
                      Your latest quiz performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {demoQuizzes.slice(0, 5).map((quiz) => (
                      <div
                        key={quiz.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/30"
                      >
                        <div className="space-y-1">
                          <div className="font-medium text-foreground">
                            {quiz.category}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {quiz.type} • {quiz.difficulty} •{" "}
                            {quiz.totalQuestions} questions
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {quiz.date}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${getScoreColor(
                              quiz.score
                            )}`}
                          >
                            {quiz.score}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="card-cyber">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Quick Stats
                    </CardTitle>
                    <CardDescription>Your key achievements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-lg bg-card/50 border border-border/30">
                        <Award className="h-6 w-6 mx-auto mb-2 text-cyber-orange" />
                        <div className="text-xl font-bold text-foreground">
                          {earnedAchievements.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Badges Earned
                        </div>
                      </div>

                      <div className="text-center p-4 rounded-lg bg-card/50 border border-border/30">
                        <Trophy className="h-6 w-6 mx-auto mb-2 text-cyber-blue" />
                        <div className="text-xl font-bold text-foreground">
                          {user.perfectScores || 12}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Perfect Scores
                        </div>
                      </div>

                      <div className="text-center p-4 rounded-lg bg-card/50 border border-border/30">
                        <Zap className="h-6 w-6 mx-auto mb-2 text-cyber-purple" />
                        <div className="text-xl font-bold text-foreground">
                          {user.currentStreak || 56}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Day Streak
                        </div>
                      </div>

                      <div className="text-center p-4 rounded-lg bg-card/50 border border-border/30">
                        <Clock className="h-6 w-6 mx-auto mb-2 text-success" />
                        <div className="text-xl font-bold text-foreground">
                          {user.fastestTime || "0:46"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Best Time
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Achievement Points
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {totalAchievementPoints} pts
                        </span>
                      </div>
                      <Progress
                        value={(totalAchievementPoints / 3000) * 100}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              <Card className="card-cyber">
                <CardHeader>
                  <CardTitle>Category Progress</CardTitle>
                  <CardDescription>
                    Track your learning journey across all cybersecurity domains
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {categoryProgress.map((category) => (
                    <div key={category.name} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">
                            {category.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {category.completed}/{category.total} quizzes •{" "}
                            {category.level} level
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={getRarityColor(
                            category.level.toLowerCase()
                          )}
                        >
                          {category.percentage}%
                        </Badge>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="space-y-6">
              <Card className="card-cyber">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Earned Badges
                  </CardTitle>
                  <CardDescription>
                    Special recognition badges for your accomplishments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements
                      .filter((a) => a.earned)
                      .map((badge) => (
                        <div
                          key={badge.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-success/20 hover:border-success/40 transition-all duration-300"
                        >
                          <div className="relative p-2 rounded-lg bg-gradient-to-br from-primary/10 to-success/10">
                            <img
                              src={badge.image}
                              alt={badge.name}
                              className="h-8 w-8 object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-foreground text-sm">
                              {badge.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {badge.category}
                            </div>
                            <div className="text-xs text-success">
                              Earned{" "}
                              {new Date(badge.earnedDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-r from-success to-primary text-primary-foreground border-0 text-xs">
                            {badge.points}pts
                          </Badge>
                        </div>
                      ))}
                  </div>

                  {achievements.filter((a) => a.earned).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>
                        No badges earned yet. Complete more challenges to earn
                        your first badge!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Achievements
                    </h2>
                    <p className="text-muted-foreground">
                      {earnedAchievements.length} of {achievements.length}{" "}
                      badges earned • {totalAchievementPoints} total points
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success/20 border-2 border-success"></div>
                      <span className="text-muted-foreground">Earned</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-muted border-2 border-border"></div>
                      <span className="text-muted-foreground">Locked</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {achievements.map((achievement) => (
                    <Card
                      key={achievement.id}
                      className={`card-cyber relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                        achievement.earned
                          ? "bg-gradient-to-br from-success/5 to-primary/5 border-success/30 shadow-lg hover:shadow-success/10"
                          : "bg-muted/30 border-muted opacity-75 hover:opacity-90"
                      }`}
                    >
                      {achievement.earned && (
                        <div className="absolute top-2 right-2 z-10">
                          <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                            <Trophy className="w-3 h-3 text-success-foreground" />
                          </div>
                        </div>
                      )}

                      <CardHeader className="pb-3">
                        <div className="flex flex-col items-center text-center space-y-3">
                          <div
                            className={`relative p-4 rounded-xl transition-all duration-300 ${
                              achievement.earned
                                ? "bg-gradient-to-br from-primary/10 to-success/10 ring-2 ring-success/20 shadow-lg"
                                : "bg-muted/50 grayscale"
                            }`}
                          >
                            <img
                              src={achievement.image}
                              alt={achievement.name}
                              className={`h-16 w-16 object-contain transition-all duration-300 ${
                                achievement.earned
                                  ? "filter-none"
                                  : "opacity-50"
                              }`}
                            />
                            {!achievement.earned && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                                <div className="w-6 h-6 rounded-full border-2 border-muted-foreground bg-background/80 flex items-center justify-center">
                                  <span className="text-xs font-bold text-muted-foreground">
                                    🔒
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <CardTitle
                              className={`text-base font-bold ${
                                achievement.earned
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {achievement.name}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getRarityColor(
                                achievement.rarity
                              )}`}
                            >
                              {achievement.rarity}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 space-y-4">
                        <CardDescription
                          className={`text-center text-sm ${
                            achievement.earned
                              ? "text-muted-foreground"
                              : "text-muted-foreground/70"
                          }`}
                        >
                          {achievement.description}
                        </CardDescription>

                        <div className="space-y-3">
                          <div
                            className={`text-xs p-2 rounded-lg border ${
                              achievement.earned
                                ? "bg-success/5 border-success/20 text-foreground"
                                : "bg-muted/30 border-muted text-muted-foreground"
                            }`}
                          >
                            <div className="font-medium mb-1">Task:</div>
                            <div>{achievement.requirement}</div>
                          </div>

                          {achievement.progress && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span
                                  className={
                                    achievement.earned
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }
                                >
                                  Progress
                                </span>
                                <span
                                  className={`font-medium ${
                                    achievement.earned
                                      ? "text-success"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {achievement.progress.current}/
                                  {achievement.progress.required}
                                </span>
                              </div>
                              <Progress
                                value={
                                  (achievement.progress.current /
                                    achievement.progress.required) *
                                  100
                                }
                                className={`h-1.5 ${
                                  achievement.earned
                                    ? "progress-success"
                                    : "opacity-50"
                                }`}
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-border/30">
                            <span
                              className={`text-xs font-bold ${
                                achievement.earned
                                  ? "text-cyber-orange"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {achievement.points} pts
                            </span>
                            <Badge
                              variant={
                                achievement.earned ? "default" : "secondary"
                              }
                              className={`text-xs ${
                                achievement.earned
                                  ? "bg-gradient-to-r from-success to-primary text-primary-foreground border-0 shadow-md"
                                  : "bg-muted text-muted-foreground border-muted"
                              }`}
                            >
                              {achievement.earned ? "✓ Earned" : "🔒 Locked"}
                            </Badge>
                          </div>

                          {achievement.earnedDate && (
                            <div className="text-xs text-success bg-success/10 px-2 py-1 rounded-md text-center border border-success/20">
                              Earned on{" "}
                              {new Date(
                                achievement.earnedDate
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="card-cyber">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account preferences and security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {themes.map((theme) => (
                      <div key={theme.name} className="space-y-3">
                        <ThemePreview themeName={theme.name} />
                        <div className="text-center">
                          <h3 className="font-medium text-foreground text-sm">
                            {theme.label}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {theme.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">
                      Current Theme
                    </h4>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {themes.find((t) => t.name === currentTheme)?.icon}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">
                          {themes.find((t) => t.name === currentTheme)?.label}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {
                            themes.find((t) => t.name === currentTheme)
                              ?.description
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-card/50 border border-border/30">
                    <h4 className="font-medium text-foreground mb-2">
                      Account Information
                    </h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Email: {user.email}</p>
                      <p>Provider: {user.provider || "Local Account"}</p>
                      <p>Member since: {user.createdAt}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-12">
                      <Edit className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="h-12">
                      <Settings className="h-4 w-4 mr-2" />
                      Update Email
                    </Button>
                    <Button variant="outline" className="h-12">
                      <Shield className="h-4 w-4 mr-2" />
                      Privacy Settings
                    </Button>
                    <Button variant="outline" className="h-12">
                      <Settings className="h-4 w-4 mr-2" />
                      Notifications
                    </Button>
                  </div>

                  <div className="pt-6 border-t border-destructive/20">
                    <h4 className="text-lg font-medium text-destructive mb-4">
                      Danger Zone
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Button variant="destructive" className="h-12">
                        Reset Progress
                      </Button>
                      <Button variant="destructive" className="h-12">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
      />
    </>
  );
};

export default Profile;
