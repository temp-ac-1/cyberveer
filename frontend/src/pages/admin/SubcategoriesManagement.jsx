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
import { Search, Filter, Edit, Trash2, Plus, Layers } from 'lucide-react';

const SubcategoriesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mock data
  const subcategories = [
    {
      id: 1,
      name: 'SQL Injection',
      parentCategory: 'Web Security',
      description: 'Database injection vulnerabilities and prevention techniques',
      quizCount: 5,
      status: 'Active',
      createdDate: '2024-01-01'
    },
    {
      id: 2,
      name: 'Cross-Site Scripting (XSS)',
      parentCategory: 'Web Security',
      description: 'Client-side injection attacks and mitigation strategies',
      quizCount: 3,
      status: 'Active',
      createdDate: '2024-01-02'
    },
    {
      id: 3,
      name: 'CSRF Protection',
      parentCategory: 'Web Security',
      description: 'Cross-site request forgery attacks and defenses',
      quizCount: 2,
      status: 'Active',
      createdDate: '2024-01-03'
    },
    {
      id: 4,
      name: 'Symmetric Encryption',
      parentCategory: 'Cryptography',
      description: 'Encryption algorithms using shared keys',
      quizCount: 6,
      status: 'Active',
      createdDate: '2024-01-04'
    },
    {
      id: 5,
      name: 'Asymmetric Encryption',
      parentCategory: 'Cryptography',
      description: 'Public-key cryptography and digital signatures',
      quizCount: 4,
      status: 'Active',
      createdDate: '2024-01-05'
    },
    {
      id: 6,
      name: 'Hash Functions',
      parentCategory: 'Cryptography',
      description: 'Cryptographic hash functions and their applications',
      quizCount: 3,
      status: 'Active',
      createdDate: '2024-01-06'
    },
    {
      id: 7,
      name: 'Firewall Configuration',
      parentCategory: 'Network Security',
      description: 'Network firewall rules and configuration best practices',
      quizCount: 3,
      status: 'Active',
      createdDate: '2024-01-07'
    },
    {
      id: 8,
      name: 'Intrusion Detection',
      parentCategory: 'Network Security',
      description: 'Network monitoring and intrusion detection systems',
      quizCount: 2,
      status: 'Inactive',
      createdDate: '2024-01-08'
    },
    {
      id: 9,
      name: 'Static Analysis',
      parentCategory: 'Malware Analysis',
      description: 'Analyzing malware without executing it',
      quizCount: 2,
      status: 'Active',
      createdDate: '2024-01-09'
    },
    {
      id: 10,
      name: 'Dynamic Analysis',
      parentCategory: 'Malware Analysis',
      description: 'Runtime analysis of malicious software behavior',
      quizCount: 2,
      status: 'Active',
      createdDate: '2024-01-10'
    },
  ];

  const categories = [...new Set(subcategories.map(sub => sub.parentCategory))];

  const getStatusColor = (status) => {
    return status === 'Active' ? 'default' : 'secondary';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Web Security': 'default',
      'Cryptography': 'secondary',
      'Network Security': 'outline',
      'Malware Analysis': 'destructive',
    };
    return colors[category] || 'outline';
  };

  const filteredSubcategories = subcategories.filter(subcategory => {
    const matchesSearch =
      subcategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategory.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || subcategory.parentCategory === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Subcategories Management</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Subcategory
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
                placeholder="Search by subcategory name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Parent Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Subcategories Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Subcategories ({filteredSubcategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subcategory ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Quizzes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubcategories.map((subcategory) => (
                <TableRow key={subcategory.id}>
                  <TableCell className="font-medium">#{subcategory.id}</TableCell>
                  <TableCell className="font-medium">{subcategory.name}</TableCell>
                  <TableCell>
                    <Badge variant={getCategoryColor(subcategory.parentCategory)}>
                      {subcategory.parentCategory}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      {subcategory.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="gap-1">
                      {subcategory.quizCount} quizzes
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(subcategory.status)}>
                      {subcategory.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{subcategory.createdDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
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

      {/* Quick Stats by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
              const categorySubcategories = subcategories.filter(sub => sub.parentCategory === category);
              const totalQuizzes = categorySubcategories.reduce((sum, sub) => sum + sub.quizCount, 0);

              return (
                <div key={category} className="p-4 border border-border rounded-lg">
                  <Badge variant={getCategoryColor(category)} className="mb-2">
                    {category}
                  </Badge>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {categorySubcategories.length} subcategories
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {totalQuizzes} total quizzes
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubcategoriesManagement;
