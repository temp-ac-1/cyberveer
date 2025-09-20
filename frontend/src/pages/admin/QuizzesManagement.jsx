import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Filter, Edit, Trash2, Eye, Plus, BarChart3 } from 'lucide-react';

const QuizzesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  // Mock data
  const quizzes = [
    {
      id: 1,
      title: 'SQL Injection Fundamentals',
      category: 'Web Security',
      subcategory: 'Injection Attacks',
      difficulty: 'Beginner',
      totalQuestions: 15,
      attempts: 156,
      averageScore: 78,
      status: 'Published',
      createdDate: '2024-01-10'
    },
    {
      id: 2,
      title: 'Advanced Cryptography',
      category: 'Cryptography',
      subcategory: 'Symmetric Encryption',
      difficulty: 'Advanced',
      totalQuestions: 25,
      attempts: 89,
      averageScore: 65,
      status: 'Published',
      createdDate: '2024-01-08'
    },
    {
      id: 3,
      title: 'Network Protocol Analysis',
      category: 'Network Security',
      subcategory: 'Traffic Analysis',
      difficulty: 'Intermediate',
      totalQuestions: 20,
      attempts: 234,
      averageScore: 82,
      status: 'Published',
      createdDate: '2024-01-05'
    },
    {
      id: 4,
      title: 'Malware Detection Basics',
      category: 'Malware Analysis',
      subcategory: 'Static Analysis',
      difficulty: 'Beginner',
      totalQuestions: 12,
      attempts: 45,
      averageScore: 71,
      status: 'Draft',
      createdDate: '2024-01-15'
    },
    {
      id: 5,
      title: 'Social Engineering Tactics',
      category: 'Social Engineering',
      subcategory: 'Phishing',
      difficulty: 'Intermediate',
      totalQuestions: 18,
      attempts: 178,
      averageScore: 85,
      status: 'Published',
      createdDate: '2024-01-01'
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'default';
      case 'Intermediate': return 'secondary';
      case 'Advanced': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Published' ? 'default' : 'secondary';
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || quiz.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Quizzes Management</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Quiz
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by quiz title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Web Security">Web Security</SelectItem>
                <SelectItem value="Network Security">Network Security</SelectItem>
                <SelectItem value="Cryptography">Cryptography</SelectItem>
                <SelectItem value="Malware Analysis">Malware Analysis</SelectItem>
                <SelectItem value="Social Engineering">Social Engineering</SelectItem>
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quizzes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quizzes ({filteredQuizzes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Avg Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="font-medium">#{quiz.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{quiz.title}</p>
                      <p className="text-sm text-muted-foreground">{quiz.subcategory}</p>
                    </div>
                  </TableCell>
                  <TableCell>{quiz.category}</TableCell>
                  <TableCell>
                    <Badge variant={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{quiz.totalQuestions}</TableCell>
                  <TableCell className="text-center">{quiz.attempts}</TableCell>
                  <TableCell className="text-center">{quiz.averageScore}%</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(quiz.status)}>
                      {quiz.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{quiz.createdDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizzesManagement;
