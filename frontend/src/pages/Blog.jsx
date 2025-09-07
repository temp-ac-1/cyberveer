import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, PenTool, Star, TrendingUp, Clock, User, Eye, ArrowRight, Filter, Grid3X3, List, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Extended dummy data for blog articles
const blogArticles = [
  {
    id: 1,
    title: "Advanced Network Security: Zero Trust Architecture",
    slug: "zero-trust-architecture-guide",
    excerpt: "Learn how to implement Zero Trust security model in modern enterprise environments with practical examples and real-world scenarios.",
    author: { name: "Sarah Chen", avatar: "/api/placeholder/40/40" },
    category: "Network Security",
    skillLevel: "Advanced",
    readTime: "12 min",
    tags: ["Zero Trust", "Enterprise", "Architecture"],
    trending: true,
    views: 2341,
    publishedAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Malware Analysis with Wireshark: A Beginner's Guide",
    slug: "malware-analysis-wireshark-guide",
    excerpt: "Step-by-step tutorial on analyzing network traffic to detect malicious activities using Wireshark's powerful features.",
    author: { name: "Mike Rodriguez", avatar: "/api/placeholder/40/40" },
    category: "Malware Analysis",
    skillLevel: "Beginner",
    readTime: "8 min",
    tags: ["Wireshark", "Network Analysis", "Detection"],
    featured: true,
    views: 1892,
    publishedAt: "2024-01-14"
  },
  {
    id: 3,
    title: "Cryptography Fundamentals: RSA vs ECC",
    slug: "cryptography-rsa-vs-ecc",
    excerpt: "Deep dive into the mathematical foundations and practical applications of RSA and ECC encryption algorithms.",
    author: { name: "Dr. Emily Watson", avatar: "/api/placeholder/40/40" },
    category: "Cryptography",
    skillLevel: "Intermediate",
    readTime: "15 min",
    tags: ["RSA", "ECC", "Mathematics", "Encryption"],
    views: 3401,
    publishedAt: "2024-01-13"
  },
  // ... keep the rest of your articles unchanged ...
];

const categories = ["All", "Network Security", "Malware Analysis", "Cryptography", "Secure Coding", "Threat Hunting", "Penetration Testing", "Cloud Security", "SIEM", "Mobile Security", "Incident Response", "API Security", "Blockchain Security", "Red Team", "Container Security", "Social Engineering"];
const skillLevels = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const tags = ["Wireshark", "OWASP", "Linux", "Threat Hunting", "Zero Trust", "RSA", "Node.js", "Pentesting", "AWS", "Cloud", "SIEM", "Mobile", "API", "Blockchain", "Docker", "Kubernetes"];
const sortOptions = ["Most Recent", "Trending", "Most Viewed"];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSkillLevel, setSelectedSkillLevel] = useState("All Levels");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState("Most Recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const articlesPerPage = 9;

  const getSkillLevelColor = (level) => {
    switch (level) {
      case "Beginner": 
        return "bg-secondary/20 text-secondary border-secondary/30";
      case "Intermediate": 
        return "bg-accent/20 text-accent border-accent/30";
      case "Advanced": 
        return "bg-destructive/20 text-destructive border-destructive/30";
      default: 
        return "bg-muted text-muted-foreground border-muted/30";
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredArticles = blogArticles.filter(article => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    const matchesSkillLevel = selectedSkillLevel === "All Levels" || article.skillLevel === selectedSkillLevel;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => article.tags.includes(tag));
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSkillLevel && matchesTags && matchesSearch;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case "Most Viewed": return b.views - a.views;
      case "Trending": return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      default: return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
  });

  const totalPages = Math.ceil(sortedArticles.length / articlesPerPage);
  const currentArticles = sortedArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  const featuredArticles = blogArticles.filter(article => article.featured || article.trending);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Modern Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
        <div className="container mx-auto max-w-7xl text-center relative z-10">
          <div className="animate-fade-in">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <BookOpen className="w-4 h-4 mr-2" />
              Knowledge Hub
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Cybersecurity
              </span>
              <br />
              <span className="text-foreground">Insights Hub</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover cutting-edge cybersecurity articles, tutorials, and insights from industry experts. 
              Stay ahead of threats and enhance your security knowledge.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link to="/blog/write">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-glow transition-all duration-300 px-8 py-4">
                <PenTool className="w-5 h-5 mr-2" />
                Write Your Article
              </Button>
            </Link>
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search cybersecurity topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-card/50 border-border/50 focus:border-primary/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Expert Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">5K+</div>
              <div className="text-muted-foreground">Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">12+</div>
              <div className="text-muted-foreground">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filter Section */}
      <section className="py-12 px-4 bg-card/30 border-y border-border/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Filters */}
            <div className="lg:w-1/4 space-y-8">
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 8).map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="rounded-full text-xs"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
                <h3 className="text-lg font-semibold mb-4">Skill Level</h3>
                <div className="flex flex-wrap gap-2">
                  {skillLevels.map((level) => (
                    <Button
                      key={level}
                      variant={selectedSkillLevel === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSkillLevel(level)}
                      className="rounded-full text-xs"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
                <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 10).map((tag) => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                      className="rounded-full text-xs"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:w-3/4">
              {/* Control Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <div className="text-muted-foreground">
                  <span className="text-lg font-medium text-foreground">{sortedArticles.length}</span> articles found
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    {sortOptions.map((option) => (
                      <Button
                        key={option}
                        variant={sortBy === option ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSortBy(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  <div className="flex border border-border/50 rounded-lg p-1 bg-card/50">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="p-2"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="p-2"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Featured Articles */}
              {featuredArticles.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500" />
                    Featured & Trending
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredArticles.slice(0, 4).map((article) => (
                      <Link key={article.id} to={`/blog/${article.slug}`}>
                        <Card className="group hover:shadow-glow transition-all duration-500 cursor-pointer border-border/50 hover:border-primary/30 relative overflow-hidden bg-card/80 backdrop-blur-sm h-full">
                          {article.featured && (
                            <div className="absolute top-4 left-4 z-10">
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                ⭐ Editor's Pick
                              </Badge>
                            </div>
                          )}
                          {article.trending && (
                            <div className="absolute top-4 right-4 z-10">
                              <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                                🔥 Trending
                              </Badge>
                            </div>
                          )}
                          <CardHeader className="pb-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                                <img 
                                  src={article.author.avatar} 
                                  alt={article.author.name} 
                                  className="w-full h-full rounded-full bg-card object-cover" 
                                />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{article.author.name}</p>
                                <p className="text-sm text-muted-foreground">{article.category}</p>
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors leading-tight line-clamp-2">
                              {article.title}
                            </h3>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge className={getSkillLevelColor(article.skillLevel)}>
                                {article.skillLevel}
                              </Badge>
                              {article.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs border-border/50">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {article.readTime}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  {article.views.toLocaleString()}
                                </span>
                              </div>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles Grid/List */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">All Articles</h2>
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                  {currentArticles.map((article) => (
                    <Link key={article.id} to={`/blog/${article.slug}`}>
                      <Card className={`group hover:shadow-glow transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30 bg-card/80 backdrop-blur-sm ${viewMode === "list" ? "flex flex-row overflow-hidden h-40" : ""}`}>
                        {viewMode === "list" ? (
                          <>
                            <div className="w-1/3 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-primary/50" />
                            </div>
                            <div className="w-2/3 p-6 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                                    <img 
                                      src={article.author.avatar} 
                                      alt={article.author.name} 
                                      className="w-full h-full rounded-full bg-card object-cover" 
                                    />
                                  </div>
                                  <span className="text-sm text-muted-foreground">{article.author.name}</span>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground">{article.category}</span>
                                </div>
                                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-2 line-clamp-1">
                                  {article.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge className={getSkillLevelColor(article.skillLevel)}>
                                    {article.skillLevel}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">{article.readTime}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <CardHeader className="pb-4">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                                  <img 
                                    src={article.author.avatar} 
                                    alt={article.author.name} 
                                    className="w-full h-full rounded-full bg-card object-cover" 
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{article.author.name}</p>
                                  <p className="text-sm text-muted-foreground">{article.category}</p>
                                </div>
                              </div>
                              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors leading-tight line-clamp-2">
                                {article.title}
                              </h3>
                            </CardHeader>
                            <CardContent>
                              <p className="text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                <Badge className={getSkillLevelColor(article.skillLevel)}>
                                  {article.skillLevel}
                                </Badge>
                                {article.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs border-border/50">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {article.readTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {article.views.toLocaleString()}
                                  </span>
                                </div>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </CardContent>
                          </>
                        )}
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Enhanced Pagination */}
              {totalPages > 1 && (
                <Pagination className="justify-center">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {/* First page */}
                    {currentPage > 3 && (
                      <>
                        <PaginationItem>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(1);
                            }}
                            isActive={currentPage === 1}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                        {currentPage > 4 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                      </>
                    )}

                    {/* Pages around current */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => page >= Math.max(1, currentPage - 2) && page <= Math.min(totalPages, currentPage + 2))
                      .map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    {/* Last page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(totalPages);
                            }}
                            isActive={currentPage === totalPages}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}

                    <PaginationItem>
                      <PaginationNext 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Join the Cybersecurity Community</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Share your expertise, learn from others, and help build a safer digital world together.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:shadow-glow transition-all duration-300 px-8">
              <PenTool className="w-5 h-5 mr-2" />
              Write an Article
            </Button>
            <Button size="lg" variant="outline" className="border-primary/50 hover:border-primary">
              <User className="w-5 h-5 mr-2" />
              Join Community
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-muted-foreground">Articles Published</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary mb-2">50K+</div>
              <div className="text-muted-foreground">Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-2">500+</div>
              <div className="text-muted-foreground">Expert Authors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Ahead of Cyber Threats</h2>
          <p className="text-muted-foreground mb-8">
            Get weekly insights, breaking news, and expert analysis delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
            <Input
              placeholder="Enter your email address"
              type="email"
              className="flex-1 bg-background/50 border-border/50 focus:border-primary/50"
            />
            <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Join 10,000+ cybersecurity professionals. No spam, unsubscribe anytime.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
