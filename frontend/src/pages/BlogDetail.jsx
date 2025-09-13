import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Clock, User, Calendar, Copy, ThumbsUp, Heart, 
  Lightbulb, ChevronUp, BookOpen, Shield, Lock, 
  Network, Code, Edit, Twitter, Linkedin 
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from "@/components/ui/breadcrumb";
import Navbar from "@/components/Navbar";
import CommentSection from "@/components/CommentSection";
import Footer from "@/components/Footer";

// Dummy blog data
const blogPost = {
  id: 1,
  slug: "zero-trust-architecture-guide",
  title: "Advanced Network Security: Zero Trust Architecture Implementation Guide",
  excerpt: "Learn how to implement Zero Trust security model in modern enterprise environments with practical examples and best practices.",
  content: `
    <h2>Introduction to Zero Trust Architecture</h2>
    <p>Zero Trust Architecture (ZTA) represents a paradigm shift in network security, moving away from the traditional "trust but verify" model to "never trust, always verify." This comprehensive guide will walk you through implementing ZTA in your organization.</p>

    <div class="callout-box tip">
      <strong>💡 Key Insight:</strong> Zero Trust isn't a single technology, but a security framework that requires identity verification for every person and device trying to access resources.
    </div>

    <h3>Core Principles of Zero Trust</h3>
    <p>Zero Trust architecture is built on several fundamental principles:</p>
    <ul>
      <li><strong>Verify explicitly:</strong> Always authenticate and authorize based on all available data points</li>
      <li><strong>Use least privilege access:</strong> Limit user access with Just-In-Time and Just-Enough-Access (JIT/JEA)</li>
      <li><strong>Assume breach:</strong> Minimize blast radius and segment access</li>
    </ul>

    <h2>Implementation Strategy</h2>
    <p>Implementing Zero Trust requires a systematic approach. Here's a step-by-step strategy:</p>

    <h3>Phase 1: Assessment and Planning</h3>
    <p>Before implementing Zero Trust, you need to understand your current security posture:</p>

    <div class="code-block">
      <pre><code class="language-bash"># Network discovery and mapping
nmap -sn 192.168.1.0/24
nslookup domain.com
dig domain.com ANY</code></pre>
    </div>

    <div class="callout-box warning">
      <strong>⚠️ Important:</strong> Never run network scanning tools on networks you don't own or without proper authorization.
    </div>

    <h3>Identity and Access Management (IAM)</h3>
    <p>IAM is the cornerstone of Zero Trust. Here's how to strengthen your identity controls:</p>

    <ol>
      <li><strong>Multi-Factor Authentication (MFA):</strong> Implement MFA for all users</li>
      <li><strong>Privileged Access Management (PAM):</strong> Control and monitor privileged accounts</li>
      <li><strong>Single Sign-On (SSO):</strong> Centralize authentication</li>
    </ol>

    <h2>Network Segmentation</h2>
    <p>Network segmentation is crucial for limiting lateral movement in case of a breach:</p>

    <div class="code-block">
      <pre><code class="language-yaml"># Example firewall rule configuration
rules:
  - name: "Block lateral movement"
    action: deny
    source: internal_network
    destination: dmz_network
    port: any
    protocol: any</code></pre>
    </div>

    <h3>Micro-segmentation</h3>
    <p>Micro-segmentation takes network segmentation to the next level by creating security zones around individual workloads:</p>

    <blockquote>
      "Micro-segmentation enables organizations to reduce their attack surface by creating secure zones in data centers and cloud deployments." - NIST Cybersecurity Framework
    </blockquote>

    <h2>Monitoring and Analytics</h2>
    <p>Continuous monitoring is essential for Zero Trust effectiveness:</p>

    <h3>Security Information and Event Management (SIEM)</h3>
    <p>Implement comprehensive logging and monitoring:</p>

    <div class="code-block">
      <pre><code class="language-json">{
  "event_type": "authentication",
  "timestamp": "2024-01-15T10:30:00Z",
  "user": "john.doe@company.com",
  "source_ip": "192.168.1.100",
  "result": "success",
  "risk_score": 2.5
}</code></pre>
    </div>

    <div class="callout-box tip">
      <strong>💡 Best Practice:</strong> Use behavioral analytics to detect anomalous user behavior that might indicate compromised accounts.
    </div>

    <h2>Common Challenges and Solutions</h2>
    <p>Implementing Zero Trust comes with challenges. Here are common issues and their solutions:</p>

    <table>
      <thead>
        <tr>
          <th>Challenge</th>
          <th>Solution</th>
          <th>Timeline</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Legacy system compatibility</td>
          <td>Phased migration approach</td>
          <td>6-12 months</td>
        </tr>
        <tr>
          <td>User experience impact</td>
          <td>SSO and adaptive authentication</td>
          <td>3-6 months</td>
        </tr>
        <tr>
          <td>Cost and complexity</td>
          <td>Start with high-risk areas</td>
          <td>Ongoing</td>
        </tr>
      </tbody>
    </table>

    <h2>Conclusion</h2>
    <p>Zero Trust Architecture is not a destination but a journey. It requires continuous improvement and adaptation to evolving threats. By following the principles and implementation strategies outlined in this guide, you can significantly enhance your organization's security posture.</p>

    <div class="callout-box info">
      <strong>📚 Next Steps:</strong> Start with a pilot project in a high-risk area of your network. Gradually expand the Zero Trust principles across your entire infrastructure.
    </div>
  `,
  author: {
    name: "Sarah Chen",
    avatar: "/api/placeholder/60/60",
    title: "Senior Security Architect"
  },
  category: "Network Security",
  skillLevel: "Advanced",
  readTime: "12 min",
  publishedAt: "2024-01-15",
  tags: ["Zero Trust", "Enterprise", "Architecture", "Network Security", "IAM"],
  views: 2341,
  likes: 89,
  bookmarks: 156
};

// Related articles
const relatedArticles = [
  {
    id: 2,
    title: "Implementing Multi-Factor Authentication in Enterprise Environments",
    category: "Identity Security",
    skillLevel: "Intermediate",
    readTime: "8 min",
    slug: "mfa-enterprise-guide"
  },
  {
    id: 3,
    title: "Network Segmentation Best Practices for Cloud Infrastructure",
    category: "Cloud Security",
    skillLevel: "Advanced",
    readTime: "15 min", 
    slug: "network-segmentation-cloud"
  },
  {
    id: 4,
    title: "SIEM Configuration for Zero Trust Monitoring",
    category: "Security Operations",
    skillLevel: "Advanced", 
    readTime: "20 min",
    slug: "siem-zero-trust"
  }
];

// Table of contents
const tableOfContents = [
  { id: "introduction", title: "Introduction to Zero Trust Architecture", level: 2 },
  { id: "core-principles", title: "Core Principles of Zero Trust", level: 3 },
  { id: "implementation", title: "Implementation Strategy", level: 2 },
  { id: "phase-1", title: "Phase 1: Assessment and Planning", level: 3 },
  { id: "iam", title: "Identity and Access Management (IAM)", level: 3 },
  { id: "network-segmentation", title: "Network Segmentation", level: 2 },
  { id: "micro-segmentation", title: "Micro-segmentation", level: 3 },
  { id: "monitoring", title: "Monitoring and Analytics", level: 2 },
  { id: "siem", title: "Security Information and Event Management (SIEM)", level: 3 },
  { id: "challenges", title: "Common Challenges and Solutions", level: 2 },
  { id: "conclusion", title: "Conclusion", level: 2 }
];

const BlogDetail = () => {
  const { slug } = useParams();
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [reactions, setReactions] = useState({
    likes: blogPost.likes,
    hearts: 23,
    insights: 15
  });

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
      setShowScrollTop(window.scrollY > 500);

      const sections = tableOfContents.map(item => document.getElementById(item.id));
      const currentSection = sections.find(section => {
        if (section) {
          const rect = section.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(blogPost.title)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
    window.open(url, "_blank");
  };

  const handleReaction = (type) => {
    setReactions(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
    toast.success("Reaction added!");
  };

  const getSkillLevelColor = (level) => {
    switch (level) {
      case "Beginner": return "bg-secondary/20 text-secondary border-secondary/30";
      case "Intermediate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Advanced": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Network Security": return <Network className="w-4 h-4" />;
      case "Identity Security": return <Shield className="w-4 h-4" />;
      case "Cloud Security": return <Lock className="w-4 h-4" />;
      case "Security Operations": return <Code className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          {/* Main Article Content */}
          <article className="flex-1 max-w-4xl">
            {/* Breadcrumb Navigation */}
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/">Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/blog">Blog</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-primary">
                      {blogPost.category}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {blogPost.title}
              </h1>
              
              {/* Author & Meta Info */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <img 
                    src={blogPost.author.avatar} 
                    alt={blogPost.author.name}
                    className="w-12 h-12 rounded-full bg-muted"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{blogPost.author.name}</p>
                    <p className="text-sm text-muted-foreground">{blogPost.author.title}</p>
                  </div>
                </div>
                
                <Separator orientation="vertical" className="h-12" />
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(blogPost.publishedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {blogPost.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {blogPost.views.toLocaleString()} views
                  </span>
                </div>
              </div>

              {/* Category & Skill Level */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="flex items-center gap-1 bg-primary/20 text-primary border-primary/30">
                  {getCategoryIcon(blogPost.category)}
                  {blogPost.category}
                </Badge>
                <Badge className={getSkillLevelColor(blogPost.skillLevel)}>
                  {blogPost.skillLevel}
                </Badge>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {blogPost.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </header>

            {/* Hero Image */}
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src="/api/placeholder/1200/400" 
                alt="Zero Trust Architecture Diagram"
                className="w-full h-64 md:h-80 object-cover bg-muted"
              />
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2 mb-8 p-4 bg-card border rounded-lg">
              <span className="text-sm font-medium text-muted-foreground mr-2">Share:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={shareToTwitter}
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="w-4 h-4 mr-1" />
                Twitter
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={shareToLinkedIn}
                className="text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="w-4 h-4 mr-1" />
                LinkedIn
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(window.location.href)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy Link
              </Button>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blogPost.content }}
              style={{
                lineHeight: 1.7,
                fontSize: '18px'
              }}
            />

            {/* Reactions */}
            <div className="mt-12 p-6 bg-card border rounded-lg">
              <h3 className="text-lg font-semibold mb-4">How was this article?</h3>
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction('likes')}
                  className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Helpful ({reactions.likes})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction('hearts')}
                  className="flex items-center gap-2 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Heart className="w-4 h-4" />
                  Love it ({reactions.hearts})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction('insights')}
                  className="flex items-center gap-2 hover:bg-yellow-500/10 hover:text-yellow-400"
                >
                  <Lightbulb className="w-4 h-4" />
                  Insightful ({reactions.insights})
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <CommentSection />
          </article>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block w-64 sticky top-24 self-start">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                  Table of Contents
                </h3>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <nav className="space-y-2">
                    {tableOfContents.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-sm py-1 px-2 rounded transition-colors ${
                          activeSection === item.id
                            ? 'bg-primary/10 text-primary border-l-2 border-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        } ${item.level === 3 ? 'ml-4' : ''}`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Related Articles */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((article) => (
              <Card key={article.id} className="group hover:shadow-glow transition-all duration-300 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {getCategoryIcon(article.category)}
                    <span className="text-sm text-muted-foreground">{article.category}</span>
                  </div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getSkillLevelColor(article.skillLevel)}>
                        {article.skillLevel}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{article.readTime}</span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/blog/${article.slug}`}>
                        Read More
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Share Your Cybersecurity Knowledge</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Have insights, tutorials, or experiences to share with the community? 
            Start writing and help others learn cybersecurity.
          </p>
          <Link to="/blog/write">
            <Button size="lg" className="bg-gradient-cyber text-white hover:opacity-90">
              <Edit className="w-4 h-4 mr-2" />
              Write Your First Article
            </Button>
          </Link>
        </section>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 rounded-full p-3 shadow-glow z-40"
          size="sm"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
      )}

      <Footer />
    </div>
  );
};

export default BlogDetail;
