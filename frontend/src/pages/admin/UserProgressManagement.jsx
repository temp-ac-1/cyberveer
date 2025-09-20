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
import { Search, Filter, Eye, Download, BarChart3, Trophy, Clock, Target } from 'lucide-react';

const UserProgressManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');

  // Mock data
  const progressData = [
    {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
      quizTitle: 'SQL Injection Fundamentals',
      category: 'Web Security',
      score: 85,
      completionDate: '2024-01-20',
      timeSpent: '25 minutes',
      attempts: 2,
      status: 'Passed'
    },
    {
      id: 2,
      username: 'sarah_smith',
      email: 'sarah@example.com',
      quizTitle: 'Advanced Cryptography',
      category: 'Cryptography',
      score: 92,
      completionDate: '2024-01-19',
      timeSpent: '35 minutes',
      attempts: 1,
      status: 'Passed'
    },
    {
      id: 3,
      username: 'mike_wilson',
      email: 'mike@example.com',
      quizTitle: 'Network Protocol Analysis',
      category: 'Network Security',
      score: 78,
      completionDate: '2024-01-18',
      timeSpent: '30 minutes',
      attempts: 3,
      status: 'Passed'
    },
    {
      id: 4,
      username: 'alice_brown',
      email: 'alice@example.com',
      quizTitle: 'Malware Detection Basics',
      category: 'Malware Analysis',
      score: 45,
      completionDate: '2024-01-17',
      timeSpent: '20 minutes',
      attempts: 1,
      status: 'Failed'
    },
    {
      id: 5,
      username: 'bob_jones',
      email: 'bob@example.com',
      quizTitle: 'Social Engineering Tactics',
      category: 'Social Engineering',
      score: 88,
      completionDate: '2024-01-16',
      timeSpent: '28 minutes',
      attempts: 2,
      status: 'Passed'
    },
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const getStatusColor = (status) => {
    return status === 'Passed' ? 'default' : 'destructive';
  };

  const filteredProgress = progressData.filter(progress => {
    const matchesSearch =
      progress.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      progress.quizTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || progress.category === categoryFilter;
    const matchesScore =
      scoreFilter === 'all' ||
      (scoreFilter === 'high' && progress.score >= 80) ||
      (scoreFilter === 'medium' && progress.score >= 60 && progress.score < 80) ||
      (scoreFilter === 'low' && progress.score < 60);

    return matchesSearch && matchesCategory && matchesScore;
  });

  // Calculate statistics
  const totalAttempts = progressData.length;
  const averageScore = Math.round(
    progressData.reduce((sum, p) => sum + p.score, 0) / progressData.length
  );
  const passRate = Math.round(
    (progressData.filter(p => p.status === 'Passed').length / progressData.length) * 100
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">User Progress & Quiz Attempts</h1>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Attempts</p>
                <p className="text-2xl font-bold text-foreground">{totalAttempts}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-green-500/10 to-green-600/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold text-foreground">{averageScore}%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold text-foreground">{passRate}%</p>
              </div>
              <Trophy className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-orange-500/10 to-orange-600/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Time</p>
                <p className="text-2xl font-bold text-foreground">27 min</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
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
                placeholder="Search by username or quiz title..."
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
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Score Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="high">High (80-100%)</SelectItem>
                <SelectItem value="medium">Medium (60-79%)</SelectItem>
                <SelectItem value="low">Low (0-59%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Progress Table */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Attempts ({filteredProgress.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Quiz Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time Spent</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProgress.map((progress) => (
                <TableRow key={progress.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{progress.username}</p>
                      <p className="text-sm text-muted-foreground">{progress.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{progress.quizTitle}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{progress.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getScoreColor(progress.score)}>
                      {progress.score}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(progress.status)}>
                      {progress.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{progress.timeSpent}</TableCell>
                  <TableCell className="text-center">{progress.attempts}</TableCell>
                  <TableCell>{progress.completionDate}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
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

export default UserProgressManagement;
