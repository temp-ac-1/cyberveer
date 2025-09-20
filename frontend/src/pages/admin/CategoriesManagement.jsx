import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Edit, Trash2, Plus, FolderOpen } from 'lucide-react';

const CategoriesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const categories = [
    {
      id: 1,
      name: 'Web Security',
      description: 'Security vulnerabilities and defense mechanisms in web applications',
      quizCount: 12,
      subcategoriesCount: 5,
      status: 'Active',
      createdDate: '2024-01-01'
    },
    {
      id: 2,
      name: 'Network Security',
      description: 'Network protocols, firewalls, and network-based attacks',
      quizCount: 8,
      subcategoriesCount: 3,
      status: 'Active',
      createdDate: '2024-01-02'
    },
    {
      id: 3,
      name: 'Cryptography',
      description: 'Encryption, decryption, and cryptographic protocols',
      quizCount: 15,
      subcategoriesCount: 6,
      status: 'Active',
      createdDate: '2024-01-03'
    },
    {
      id: 4,
      name: 'Malware Analysis',
      description: 'Analysis and detection of malicious software',
      quizCount: 6,
      subcategoriesCount: 4,
      status: 'Active',
      createdDate: '2024-01-04'
    },
    {
      id: 5,
      name: 'Social Engineering',
      description: 'Human-based security attacks and psychological manipulation',
      quizCount: 4,
      subcategoriesCount: 2,
      status: 'Inactive',
      createdDate: '2024-01-05'
    },
  ];

  const getStatusColor = (status) => {
    return status === 'Active' ? 'default' : 'secondary';
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Categories Management</h1>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Category
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by category name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Categories ({filteredCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Quizzes</TableHead>
                <TableHead>Subcategories</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">#{category.id}</TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      {category.description}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="gap-1">
                      {category.quizCount} quizzes
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="gap-1">
                      {category.subcategoriesCount} subs
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(category.status)}>
                      {category.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{category.createdDate}</TableCell>
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Categories</p>
                <p className="text-2xl font-bold">
                  {categories.filter(c => c.status === 'Active').length}
                </p>
              </div>
              <Badge className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                ✓
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Quizzes</p>
                <p className="text-2xl font-bold">
                  {categories.reduce((sum, c) => sum + c.quizCount, 0)}
                </p>
              </div>
              <Badge variant="outline" className="h-8 w-8 rounded-full p-0 flex items-center justify-center">
                Q
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoriesManagement;
