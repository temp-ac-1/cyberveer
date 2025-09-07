import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Book, 
  Trophy,
  CheckCircle,
  Circle,
  Target,
  BookOpen,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LessonReader from '@/components/LessonReader';
import QuizTypeSelector from '@/components/QuizTypeSelector';

const CategoryDetail = () => {
  const { slug } = useParams();
  const [selectedSection, setSelectedSection] = useState(null);
  const [showQuizSelector, setShowQuizSelector] = useState(false);
  
  // Mock category data (in real app, fetch based on slug)
  const categoryData = {
    id: '1',
    title: 'Network Security',
    description: 'Master the fundamentals of network security, including firewalls, intrusion detection systems, VPNs, and network protocols. Learn to identify vulnerabilities, implement security measures, and protect against common network attacks.',
    icon: '🛡️',
    difficulty: 'Intermediate',
    overallProgress: 65,
    totalQuizzes: 15,
    completedQuizzes: 8,
    totalLessons: 42,
    completedLessons: 28,
    estimatedTime: '6 hours remaining',
    participants: 2847,
    rating: 4.8,
    pointsEarned: 1250,
    slug: 'network-security'
  };

  const [sections, setSections] = useState([
    {
      id: '1',
      title: 'Network Fundamentals',
      description: 'Learn the basics of network protocols, topologies, and communication models.',
      difficulty: 'Beginner',
      progress: 100,
      totalLessons: 8,
      completedLessons: 8,
      estimatedTime: '2 hours',
      isOpen: false,
      lessons: [
        {
          id: 'l1',
          title: 'Introduction to Computer Networks',
          content: '<h2>What is a Computer Network?</h2><p>A computer network is a collection of interconnected devices that can share resources and communicate with each other.</p>',
          difficulty: 'Beginner',
          estimatedTime: '15 min',
          completed: true
        },
        {
          id: 'l2',
          title: 'OSI Model Overview',
          content: '<h2>The OSI Model</h2><p>The OSI model is a conceptual framework with 7 layers.</p>',
          difficulty: 'Beginner',
          estimatedTime: '20 min',
          completed: true
        }
      ],
      quizzes: [
        {
          id: 'q1',
          title: 'OSI Model Quiz',
          difficulty: 'Beginner',
          questions: 10,
          timeEstimate: '5 min',
          completed: true,
          score: 85,
          slug: 'osi-model-quiz'
        },
        {
          id: 'q2',
          title: 'TCP/IP Fundamentals',
          difficulty: 'Beginner',
          questions: 15,
          timeEstimate: '8 min',
          completed: true,
          score: 92,
          slug: 'tcp-ip-fundamentals'
        }
      ]
    },
    {
      id: '2',
      title: 'Firewall Configuration',
      description: 'Master firewall rules, policies, and advanced configuration techniques.',
      difficulty: 'Intermediate',
      progress: 75,
      totalLessons: 12,
      completedLessons: 9,
      estimatedTime: '3 hours',
      isOpen: true,
      lessons: [
        {
          id: 'l3',
          title: 'Introduction to Firewalls',
          content: '<h2>What is a Firewall?</h2><p>A firewall monitors and controls network traffic.</p>',
          difficulty: 'Intermediate',
          estimatedTime: '18 min',
          completed: true
        },
        {
          id: 'l4',
          title: 'Configuring Firewall Rules',
          content: '<h2>Creating Effective Firewall Rules</h2><p>Rules should follow best practices like least privilege and logging.</p>',
          difficulty: 'Intermediate',
          estimatedTime: '22 min',
          completed: false
        }
      ],
      quizzes: [
        {
          id: 'q3',
          title: 'Firewall Rules Quiz',
          difficulty: 'Intermediate',
          questions: 20,
          timeEstimate: '12 min',
          completed: true,
          score: 78,
          slug: 'firewall-rules-quiz'
        },
        {
          id: 'q4',
          title: 'Advanced Firewall Config',
          difficulty: 'Intermediate',
          questions: 18,
          timeEstimate: '10 min',
          completed: false,
          slug: 'advanced-firewall-config'
        }
      ]
    }
  ]);

  const achievements = [
    {
      id: '1',
      title: 'Network Novice',
      description: 'Completed your first network security lesson',
      icon: '🎯',
      earned: true
    },
    {
      id: '2',
      title: 'Firewall Master',
      description: 'Scored 90%+ on all firewall quizzes',
      icon: '🔥',
      earned: true
    },
    {
      id: '3',
      title: 'Quiz Streak',
      description: 'Complete 5 quizzes in a row with 80%+ score',
      icon: '⚡',
      earned: false,
      progress: 3,
      total: 5
    }
  ];

  const toggleSection = (sectionId) => {
    setSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, isOpen: !section.isOpen }
          : section
      )
    );
  };

  const handleLessonComplete = (lessonId) => {
    setSections(prev => 
      prev.map(section => ({
        ...section,
        lessons: section.lessons.map(lesson => 
          lesson.id === lessonId 
            ? { ...lesson, completed: true }
            : lesson
        ),
        completedLessons: section.lessons.filter(l => 
          l.completed || l.id === lessonId
        ).length,
        progress: Math.round((section.lessons.filter(l => 
          l.completed || l.id === lessonId
        ).length / section.lessons.length) * 100)
      }))
    );
  };

  const openLessonReader = (sectionId) => {
    setSelectedSection(sectionId);
  };

  const closeLessonReader = () => {
    setSelectedSection(null);
  };

  const openQuizSelector = () => {
    setShowQuizSelector(true);
  };

  const closeQuizSelector = () => {
    setShowQuizSelector(false);
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              to="/categories" 
              className="flex items-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Categories
            </Link>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{categoryData.icon}</div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      {categoryData.title}
                    </h1>
                    <Badge className={getDifficultyColor(categoryData.difficulty)}>
                      {categoryData.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {categoryData.description}
                </p>
              </div>
            </div>
          </div>

          {/* Learning Path & Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Learning Path */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-2" />
                Learning Path
              </h2>
              
              <div className="space-y-4">
                {sections.map((section, index) => (
                  <Card key={section.id} className="overflow-hidden">
                    <Collapsible open={section.isOpen} onOpenChange={() => toggleSection(section.id)}>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <CardTitle className="text-lg">{section.title}</CardTitle>
                                <CardDescription>{section.description}</CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getDifficultyColor(section.difficulty)}>
                                {section.difficulty}
                              </Badge>
                              <ChevronRight className={`w-4 h-4 transition-transform ${section.isOpen ? 'rotate-90' : ''}`} />
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="grid gap-6">
                            {/* Lessons Section */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                  Theory Lessons
                                </h4>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => openLessonReader(section.id)}
                                >
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  Read Lessons
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {section.lessons.map((lesson) => (
                                  <div 
                                    key={lesson.id}
                                    className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                                  >
                                    <div className="flex items-center gap-3">
                                      {lesson.completed ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-muted-foreground" />
                                      )}
                                      <div>
                                        <div className="font-medium text-sm">{lesson.title}</div>
                                        <div className="text-xs text-muted-foreground">
                                          {lesson.estimatedTime}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                             {/* Quizzes Section */}
                             <div>
                               <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                                 Practice Quizzes
                               </h4>
                               {section.quizzes.map((quiz) => (
                                 <div 
                                   key={quiz.id}
                                   className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                 >
                                   <div className="flex items-center gap-3">
                                     {quiz.completed ? (
                                       <CheckCircle className="w-5 h-5 text-green-500" />
                                     ) : (
                                       <Circle className="w-5 h-5 text-muted-foreground" />
                                     )}
                                     <div>
                                       <div className="font-medium">{quiz.title}</div>
                                       <div className="text-sm text-muted-foreground">
                                         {quiz.questions} questions • {quiz.timeEstimate}
                                         {quiz.completed && quiz.score && (
                                           <span className="ml-2 text-green-500">
                                             Score: {quiz.score}%
                                           </span>
                                         )}
                                       </div>
                                     </div>
                                   </div>
                                   <Link to={`/quiz/${quiz.slug}`}>
                                     <Button size="sm" variant={quiz.completed ? "outline" : "default"}>
                                       {quiz.completed ? "Retake" : "Start"} Quiz
                                     </Button>
                                   </Link>
                                 </div>
                               ))}
                             </div>
                           </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        achievement.earned 
                          ? 'bg-green-500/10 border-green-500/20' 
                          : 'bg-muted/30 border-border'
                      }`}
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <div className={`font-medium ${achievement.earned ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {achievement.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {achievement.description}
                        </div>
                        {!achievement.earned && achievement.progress && achievement.total && (
                          <div className="mt-1">
                            <Progress value={(achievement.progress / achievement.total) * 100} className="h-1" />
                            <div className="text-xs text-muted-foreground mt-1">
                              {achievement.progress}/{achievement.total}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={openQuizSelector}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Take Custom Quiz
                  </Button>
                  <Link to="/Blog" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Trophy className="w-4 h-4 mr-2" />
                      View Blog
                    </Button>
                  </Link>
                  <Link to="/resources" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Book className="w-4 h-4 mr-2" />
                      Study Resources
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Practice Mode
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Lesson Reader Modal */}
      {selectedSection && (
        <LessonReader
          sectionId={selectedSection}
          sectionTitle={sections.find(s => s.id === selectedSection)?.title || ''}
          lessons={sections.find(s => s.id === selectedSection)?.lessons || []}
          onLessonComplete={handleLessonComplete}
          onClose={closeLessonReader}
        />
      )}

      {/* Quiz Type Selector Modal */}
      {showQuizSelector && (
        <QuizTypeSelector
          categorySlug={slug || ''}
          onClose={closeQuizSelector}
        />
      )}
    </div>
  );
};

export default CategoryDetail;
