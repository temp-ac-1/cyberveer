import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, AlertCircle, TrendingUp, Plus, Eye } from 'lucide-react';

const AdminDashboard = () => {
  // Mock data
  const stats = {
    totalUsers: 1247,
    totalQuizzes: 45,
    pendingActions: 3,
    averageProgress: 68
  };

  const recentUsers = [
    { id: 1, username: 'john_doe', email: 'john@example.com', status: 'Active', joinDate: '2024-01-15' },
    { id: 2, username: 'sarah_smith', email: 'sarah@example.com', status: 'Active', joinDate: '2024-01-14' },
    { id: 3, username: 'mike_wilson', email: 'mike@example.com', status: 'Pending', joinDate: '2024-01-13' },
  ];

  const recentQuizzes = [
    { id: 1, title: 'Advanced SQL Injection', category: 'Web Security', submissions: 23 },
    { id: 2, title: 'Network Protocol Analysis', category: 'Network Security', submissions: 18 },
    { id: 3, title: 'Malware Detection Techniques', category: 'Malware Analysis', submissions: 31 },
  ];

  const alerts = [
    { id: 1, message: 'Server maintenance scheduled for tonight', type: 'warning' },
    { id: 2, message: '3 users reported login issues', type: 'error' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Quiz
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border/50 bg-gradient-to-br from-blue-500/10 to-blue-600/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-green-500/10 to-green-600/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">+3 new this week</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-orange-500/10 to-orange-600/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.pendingActions}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.averageProgress}%</div>
            <p className="text-xs text-muted-foreground">+5% improvement</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Users
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{user.joinDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Quiz Submissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Quiz Activity
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                View All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <div>
                    <p className="font-medium text-foreground">{quiz.title}</p>
                    <p className="text-sm text-muted-foreground">{quiz.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{quiz.submissions} attempts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  alert.type === 'warning'
                    ? 'border-orange-200 bg-orange-50/50'
                    : 'border-red-200 bg-red-50/50'
                }`}
              >
                <AlertCircle
                  className={`h-4 w-4 ${
                    alert.type === 'warning' ? 'text-orange-500' : 'text-red-500'
                  }`}
                />
                <p className="text-sm text-foreground">{alert.message}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
