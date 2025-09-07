import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useSpring, animated, useTrail } from 'react-spring';
import { ReactTyped } from 'react-typed';
import { 
  Shield, 
  Lock, 
  Zap, 
  Trophy, 
  Users, 
  Target,
  ChevronRight,
  Globe,
  Cloud,
  Eye,
  Key,
  Network,
  BarChart3,
  BookOpen,
  Award,
  Clock,
  Star,
  Cpu,
  Binary,
  Code2,
  Heart,
  Twitter,
  Github,
  Linkedin,
  Mail
} from 'lucide-react';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HomePage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection observers for animations
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [howItWorksRef, howItWorksInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [categoriesRef, categoriesInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [benefitsRef, benefitsInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [BlogRef, BlogInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [resourcesRef, resourcesInView] = useInView({ threshold: 0.2, triggerOnce: true });

  // Hero section animation
  const heroAnimation = useSpring({
    opacity: heroInView ? 1 : 0,
    transform: heroInView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 120, friction: 25 }
  });

  // Section animations
  const howItWorksAnimation = useSpring({
    opacity: howItWorksInView ? 1 : 0,
    transform: howItWorksInView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 120, friction: 25 }
  });

  const categoriesAnimation = useSpring({
    opacity: categoriesInView ? 1 : 0,
    transform: categoriesInView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 120, friction: 25 }
  });

  // Benefits cards trail animation
  const benefitsData = [
    {
      icon: Zap,
      title: 'Learn Cybersecurity the Fun Way',
      description: 'Interactive quizzes make learning engaging and memorable'
    },
    {
      icon: BarChart3,
      title: 'AI-Driven Quiz Feedback',
      description: 'Get personalized insights and improvement recommendations'
    },
    {
      icon: Trophy,
      title: 'Climb the Blog & Compete',
      description: 'Compete with professionals and track your progress'
    }
  ];

  const benefitsTrail = useTrail(benefitsData.length, {
    opacity: benefitsInView ? 1 : 0,
    transform: benefitsInView ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 120, friction: 25 }
  });

  // Categories data
  const categories = [
    {
      icon: Network,
      title: 'Network Security',
      description: 'Protect networks from cyber threats and vulnerabilities',
      slug: 'network-security'
    },
    {
      icon: Key,
      title: 'Cryptography',
      description: 'Master encryption, decryption, and secure communications',
      slug: 'cryptography'
    },
    {
      icon: Eye,
      title: 'Ethical Hacking',
      description: 'Learn penetration testing and vulnerability assessment',
      slug: 'ethical-hacking'
    },
    {
      icon: Globe,
      title: 'Web Security',
      description: 'Secure web applications and prevent common attacks',
      slug: 'web-security'
    },
    {
      icon: Cloud,
      title: 'Cloud Security',
      description: 'Protect cloud infrastructure and services',
      slug: 'cloud-security'
    }
  ];

  // How it works steps
  const steps = [
    {
      number: '01',
      title: 'Choose Your Category',
      description: 'Select from Network Security, Ethical Hacking, Cryptography, and more specialized areas'
    },
    {
      number: '02',
      title: 'Select Difficulty & Start',
      description: 'Choose your skill level and begin your interactive cybersecurity quiz journey'
    },
    {
      number: '03',
      title: 'Track Progress & Compete',
      description: 'Learn from mistakes, track your improvement, and climb the global Blog'
    }
  ];

  // Mock Blog data
  const BlogData = [
    { name: 'Alex Chen', score: 2840, rank: 1 },
    { name: 'Sarah Johnson', score: 2735, rank: 2 },
    { name: 'Mike Rodriguez', score: 2690, rank: 3 },
    { name: 'Emma Davis', score: 2645, rank: 4 },
    { name: 'David Kim', score: 2580, rank: 5 }
  ];

  // Mock resources data
  const resources = [
    {
      title: 'Spotting Phishing Emails in 60 Seconds',
      description: 'Learn to identify malicious emails and protect yourself',
      readTime: '3 min read'
    },
    {
      title: 'Strong Passwords: A 5-Step Playbook',
      description: 'Create unbreakable passwords that keep you secure',
      readTime: '5 min read'
    }
  ];

  return (
    <>
  <div className="min-h-screen bg-white text-black">
        <Navbar />
        
        {/* Hero Section - Black & White Only */}
        <section 
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 bg-white"
          style={{
            transform: `translate3d(${mousePosition.x * 10}px, ${mousePosition.y * 10}px, 0)`
          }}
        >
          {/* Subtle grid background in black/white */}
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px',
                transform: `translate3d(${mousePosition.x * -20}px, ${mousePosition.y * -20}px, 0)`
              }}
            />
          </div>

          {/* Floating Elements - Black/White only */}
          <div 
            className="absolute top-1/4 left-1/4 text-black/10 animate-pulse"
            style={{
              transform: `translate3d(${mousePosition.x * -30}px, ${mousePosition.y * -30}px, 0)`
            }}
          >
            <Cpu size={80} />
          </div>
          <div 
            className="absolute bottom-1/3 right-1/4 text-black/10 animate-pulse"
            style={{
              transform: `translate3d(${mousePosition.x * 25}px, ${mousePosition.y * 25}px, 0)`
            }}
          >
            <Binary size={60} />
          </div>

          <animated.div 
            style={heroAnimation}
            className="relative z-10 text-center w-full max-w-6xl mx-auto"
          >
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold mb-8 text-black" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 900 }}>
              <span className="block text-black mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 900, fontSize: '5rem' }}>Level Up Your</span>
              <span className="block text-black" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 900, fontSize: '3.5rem' }}>
                <ReactTyped
                  strings={[
                    'Cybersecurity Knowledge',
                    'Hacking Skills',
                    'Online Safety',
                    'Digital Defenses'
                  ]}
                  typeSpeed={50}
                  backSpeed={30}
                  backDelay={2000}
                  loop
                />
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Interactive quizzes, curated resources, and real-time challenges to strengthen your cybersecurity knowledge and skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/quiz">
                <Button size="lg" className="bg-black text-white hover:bg-gray-900 text-lg px-8 py-4 border-0">
                  Take a Free Quiz
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#categories">
                <Button variant="outline" size="lg" className="border-black bg-white text-black font-bold text-lg px-8 py-4 hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                  Explore Categories
                </Button>
              </a>
            </div>
          </animated.div>
        </section>

        {/* How It Works Section */}
        <section ref={howItWorksRef} className="py-20 px-4 sm:px-6 lg:px-8 w-full">
          <div className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">How It Works</h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Get started with CyberVeer in three simple steps and begin your journey to cybersecurity mastery.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {steps.map((step, index) => (
                <Card key={index} className="relative group transition-all duration-300 border border-gray-200 bg-white text-black hover:shadow-lg hover:border-black">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-black">
                      {step.number}
                    </div>
                    <CardTitle className="text-xl font-bold text-black">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-gray-700">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Link to="/quiz">
                <Button size="lg" className="w-full md:w-auto text-white bg-black hover:bg-gray-800 transition-all duration-200 hover:scale-105">
                  Start Your First Quiz
                  <Target className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Quiz Categories Section */}
        <section id="categories" ref={categoriesRef} className="py-20 px-4 sm:px-6 lg:px-8 w-full">
          <animated.div style={categoriesAnimation} className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{fontFamily: "'Inter', system-ui, sans-serif"}}>Quiz Categories</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Master cybersecurity across multiple domains with our comprehensive quiz categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {categories.map((category, index) => (
                <Card key={index} className="group transition-all duration-300 border border-gray-200 bg-white text-black hover:shadow-lg hover:border-black hover:scale-105">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <category.icon className="w-6 h-6 text-black" />
                      </div>
                      <CardTitle className="text-lg font-bold text-black">{category.title}</CardTitle>
                    </div>
                    <CardDescription className="text-gray-700">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/quiz?category=${category.slug}`}>
                      <Button className="w-full text-white bg-black hover:bg-gray-800 transition-all duration-200 hover:scale-105">
                        Take Quiz
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link to="/categories">
                <Button variant="outline" size="lg" className="border-gray-300 hover:border-black text-gray-700 hover:text-black transition-all duration-200 hover:scale-105">
                  View All Categories
                </Button>
              </Link>
            </div>
          </animated.div>
        </section>

        {/* Benefits Section */}
        <section ref={benefitsRef} className="py-20 px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent" />
          
          <div className="relative w-full max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{fontFamily: "'Inter', system-ui, sans-serif"}}>Why Choose CyberVeer</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Experience the most effective way to learn cybersecurity with our innovative platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {benefitsTrail.map((style, index) => (
                <animated.div key={index} style={style}>
                  <Card className="h-full text-center transition-all duration-300 border border-gray-200 bg-white text-black hover:shadow-lg hover:border-black">
                    <CardHeader>
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        {(() => {
                          const IconComponent = benefitsData[index].icon;
                          return <IconComponent className="w-8 h-8 text-black" />;
                        })()}
                      </div>
                      <CardTitle className="text-xl font-bold text-black">{benefitsData[index].title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{benefitsData[index].description}</p>
                    </CardContent>
                  </Card>
                </animated.div>
              ))}
            </div>

            <div className="text-center">
              <Link to="/signup">
                <Button size="lg" className="text-white bg-black hover:bg-gray-800 transition-all duration-200 hover:scale-105">
                  Create Free Account
                  <Users className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Preview */}
        <section ref={BlogRef} className="py-20 px-4 sm:px-6 lg:px-8 w-full">
          <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{fontFamily: "'Inter', system-ui, sans-serif"}}>Top Performers This Week</h2>
              <p className="text-lg text-gray-400">
                See how you stack up against cybersecurity experts worldwide.
              </p>
            </div>

            <Card className="transition-all duration-300 border border-gray-200 bg-white text-black hover:shadow-lg hover:border-black">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center font-bold text-black">
                  <Trophy className="w-6 h-6 text-black mr-2" />
                  Blog
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {BlogData.map((player, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-black`}>
                          #{player.rank}
                        </div>
                        <span className="font-medium text-black">{player.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-black" />
                        <span className="font-bold text-black">{player.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-6">
                  <Link to="/Blog">
                    <Button variant="outline" className="border-gray-300 hover:border-black text-gray-700 hover:text-black transition-all duration-200 hover:scale-105">
                      View Full Blog
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Resources Section */}
        <section ref={resourcesRef} className="py-20 px-4 sm:px-6 lg:px-8 relative w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/5 to-transparent" />
          
          <div className="relative w-full max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{fontFamily: "'Inter', system-ui, sans-serif"}}>Learning Resources</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto">
                Expand your knowledge with our curated cybersecurity resources and guides.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {resources.map((resource, index) => (
                <Card key={index} className="transition-all duration-300 border border-gray-200 bg-white text-black hover:shadow-lg hover:border-black">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-2 font-bold text-black">{resource.title}</CardTitle>
                        <CardDescription className="text-gray-700">{resource.description}</CardDescription>
                      </div>
                      <BookOpen className="w-6 h-6 text-black flex-shrink-0 ml-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {resource.readTime}
                      </div>
                      <Button size="sm" variant="outline" className="border-gray-300 hover:border-black text-gray-700 hover:text-black transition-all duration-200 hover:scale-105">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link to="/resources">
                <Button size="lg" variant="outline" className="border-gray-300 hover:border-black text-gray-700 hover:text-black transition-all duration-200 hover:scale-105">
                  Explore More Resources
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Cyberpunk Footer */}
         <Footer />
      </div>

      {/* Removed intrusive global body styles and grid overlay */}
    </>
  );
};

export default HomePage;
