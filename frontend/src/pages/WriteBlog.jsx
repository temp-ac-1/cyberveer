import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import DOMPurify from 'dompurify';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, Eye, Save, Send, X } from 'lucide-react';
import 'highlight.js/styles/github-dark.css';

const CATEGORIES = [
  'Network Security',
  'Malware Analysis',
  'Cryptography',
  'Web Security',
  'Incident Response',
  'Penetration Testing',
  'Digital Forensics',
  'Security Architecture',
  'Compliance & Governance',
  'Threat Intelligence'
];

const WriteBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
    category: '',
    coverImageUrl: '',
    status: 'draft'
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);

  // Auto-save to localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('blog-draft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (formData.title || formData.content) {
        localStorage.setItem('blog-draft', JSON.stringify(formData));
      }
    }, 1000);

    return () => clearTimeout(autoSaveTimer);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(file.type)) {
        toast.error("Invalid file type");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large");
        return;
      }

      // Create URL for preview (in real app, upload to server)
      const imageUrl = URL.createObjectURL(file);
      handleInputChange('coverImageUrl', imageUrl);

      toast.success("Image uploaded");
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Title required");
      return false;
    }

    if (!formData.content.trim()) {
      toast.error("Content required");
      return false;
    }

    if (!formData.category) {
      toast.error("Category required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (status) => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        status,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        publishedAt: status === 'published' ? new Date().toISOString() : null
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Blog submission payload:', payload);

      if (status === 'published') {
        localStorage.removeItem('blog-draft');
        navigate('/blog');
      }

    } catch (error) {
      toast.error("Failed to save your blog post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sanitizeAndRenderMarkdown = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content);
    return sanitizedContent;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Write Your Article</h1>
          <p className="text-muted-foreground">Share your cybersecurity knowledge with the community</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Editor */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Article Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter your article title..."
                    className="input-cyber"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="input-cyber">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tags Input */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Add tags (press Enter or comma)"
                    className="input-cyber"
                  />
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cover Image Upload */}
                <div className="space-y-2">
                  <Label htmlFor="cover-image">Cover Image</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="cover-image"
                      type="file"
                      accept="image/png,image/jpg,image/jpeg,image/webp"
                      onChange={handleImageUpload}
                      className="input-cyber"
                    />
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {formData.coverImageUrl && (
                    <img 
                      src={formData.coverImageUrl} 
                      alt="Cover preview" 
                      className="w-full h-32 object-cover rounded-md border border-border"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Markdown Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Content *</CardTitle>
              </CardHeader>
              <CardContent>
                <MDEditor
                  value={formData.content}
                  onChange={(value) => handleInputChange('content', value || '')}
                  preview="edit"
                  height={400}
                  data-color-mode="dark"
                  visibleDragbar={false}
                />
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => handleSubmit('draft')}
                variant="outline"
                disabled={isLoading}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSubmit('published')}
                disabled={isLoading}
                className="flex-1 btn-cyber"
              >
                <Send className="h-4 w-4 mr-2" />
                Publish Article
              </Button>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Preview Header */}
                  {formData.coverImageUrl && (
                    <img 
                      src={formData.coverImageUrl} 
                      alt="Cover" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">
                      {formData.title || 'Your Article Title'}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {formData.category && (
                        <Badge variant="outline">{formData.category}</Badge>
                      )}
                      <span>By You • {new Date().toLocaleDateString()}</span>
                    </div>
                    
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Preview Content */}
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown
                      rehypePlugins={[rehypeHighlight]}
                      children={sanitizeAndRenderMarkdown(formData.content || '*Start writing to see preview...*')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WriteBlog;
