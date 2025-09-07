import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Shield, 
  Target, 
  Users, 
  Award, 
  Database, 
  Palette, 
  Monitor,
  Github,
  Linkedin,
  Mail,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const [hoveredDev, setHoveredDev] = useState(null);

  const benefits = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Interactive Learning",
      description: "Master cybersecurity concepts through engaging quizzes and hands-on challenges designed for all skill levels."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Gamified Experience",
      description: "Earn points, unlock achievements, and compete with peers while building your cybersecurity expertise."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Industry-Relevant Content",
      description: "Stay updated with the latest cybersecurity trends, threats, and defense mechanisms through curated content."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Learning",
      description: "Join a vibrant community of learners, share knowledge, and collaborate on cybersecurity challenges."
    }
  ];

  const developers = [
    {
      name: "Anurag Soni",
      role: "Backend Developer & Security Architect",
      bio: "Passionate about cybersecurity infrastructure and API development. Anurag specializes in building secure, scalable backend systems and implementing robust security protocols. With expertise in threat modeling and secure coding practices, he ensures CyberVeer's platform remains protected against emerging cyber threats.",
      skills: ["API Security", "Database Security", "Threat Modeling", "Backend Architecture"],
      icon: <Database className="w-6 h-6" />,
      gradient: "from-blue-500 to-cyan-500",
      social: {
        github: "#",
        linkedin: "#",
        email: "anurag@cyberveer.com"
      }
    },
    {
      name: "Dixit Thummar",
      role: "Full-Stack Developer & UX Designer",
      bio: "Creative full-stack developer with a passion for intuitive user experiences. Dixit combines technical expertise with design thinking to create engaging, accessible interfaces that make cybersecurity learning enjoyable. His focus on responsive design and user-centric development drives CyberVeer's frontend innovation.",
      skills: ["React/TypeScript", "UI/UX Design", "Frontend Security", "Responsive Design"],
      icon: <Palette className="w-6 h-6" />,
      gradient: "from-purple-500 to-pink-500",
      social: {
        github: "#",
        linkedin: "#",
        email: "dixit@cyberveer.com"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
        <div className="circuit-bg absolute inset-0 opacity-30" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">About CyberVeer</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              Empowering the Next Generation of
              <span className="block text-primary">Cyber Defenders</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              CyberVeer is a cutting-edge platform that transforms cybersecurity education through 
              interactive quizzes, real-world challenges, and gamified learning experiences. 
              We make cybersecurity accessible, engaging, and effective for students and professionals alike.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                In today's digital landscape, cybersecurity skills are no longer optional—they're essential. 
                CyberVeer bridges the gap between theoretical knowledge and practical application, 
                providing learners with the tools and confidence to protect our digital world.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">Make cybersecurity education accessible to everyone</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">Foster a community of security-conscious individuals</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-muted-foreground">Bridge the cybersecurity skills gap through practical learning</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl transform rotate-3" />
              <Card className="relative bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Monitor className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Learn by Doing</h3>
                      <p className="text-sm text-muted-foreground">Hands-on cybersecurity education</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Our platform emphasizes practical learning through interactive challenges, 
                    real-world scenarios, and immediate feedback to ensure knowledge retention and skill development.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose CyberVeer?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the advantages that make CyberVeer the preferred choice for cybersecurity learning
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <div className="text-primary">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Developers */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet the Developers</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The passionate minds behind CyberVeer, dedicated to making cybersecurity education accessible and engaging
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {developers.map((dev, index) => (
              <Card 
                key={index} 
                className={`group hover:shadow-xl transition-all duration-500 bg-card/80 backdrop-blur-sm border-border/50 ${
                  hoveredDev === dev.name ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredDev(dev.name)}
                onMouseLeave={() => setHoveredDev(null)}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${dev.gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <div className="text-white">
                        {dev.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{dev.name}</h3>
                      <p className="text-primary font-medium mb-3">{dev.role}</p>
                      <div className="flex gap-3">
                        <a href={dev.social.github} className="text-muted-foreground hover:text-primary transition-colors">
                          <Github className="w-5 h-5" />
                        </a>
                        <a href={dev.social.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                          <Linkedin className="w-5 h-5" />
                        </a>
                        <a href={`mailto:${dev.social.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                          <Mail className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">{dev.bio}</p>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {dev.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Cybersecurity Journey?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already building their cybersecurity expertise with CyberVeer. 
            Start with our beginner-friendly quizzes or challenge yourself with advanced security scenarios.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/quiz">
                Start Learning
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/categories">
                Explore Categories
              </Link>
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border/50">
            <p className="text-muted-foreground mb-4">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="flex justify-center gap-6">
              <a 
                href="mailto:hello@cyberveer.com" 
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                hello@cyberveer.com
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
