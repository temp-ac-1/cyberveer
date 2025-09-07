import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Twitter,
  Github,
  Linkedin,
  Mail,
  Code2,
  Heart,
  Cpu,
  Zap,
  Lock,
  Brain,
  Network,
  Terminal,
  Sparkles,
  ScanEye,
  Binary,
  Award,
  Users,
  BookOpen,
  BarChart3,
  Clock,
  MessageSquare,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <div className="w-full relative overflow-hidden bg-gray-900/95 backdrop-blur-xl border-t border-cyan-400/40">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(0, 243, 255, 0.15) 25%, transparent 25%, transparent 75%, rgba(0, 243, 255, 0.15) 75%, rgba(0, 243, 255, 0.15)),
              linear-gradient(-45deg, rgba(0, 243, 255, 0.15) 25%, transparent 25%, transparent 75%, rgba(0, 243, 255, 0.15) 75%, rgba(0, 243, 255, 0.15))
            `,
            backgroundSize: "60px 60px",
            backgroundPosition: "0 0",
          }}
        />
      </div>

      {/* Glowing data stream effects */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent shadow-[0_0_8px_rgba(0,255,255,0.3)] animate-pulse" />

      {/* Main footer */}
      <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12 py-14 mx-auto max-w-7xl">
        {/* Top section */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 mb-16">
          {/* Brand */}
          <div className="text-center lg:text-left lg:max-w-md">
            <div className="flex items-center justify-center lg:justify-start space-x-3 mb-5">
              <div className="p-2.5 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-cyan-400/10 animate-pulse"></div>
                <Shield className="w-7 h-7 text-cyan-400 relative z-10" />
              </div>
              <span className="text-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text font-bold text-2xl tracking-tight">
                CYBERVEER
              </span>
            </div>
            <p className="text-gray-400 mb-7 leading-relaxed">
              Fortifying digital frontiers through immersive cybersecurity
              education and real-world challenges
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
              {[
                { icon: Users, value: "10K+", label: "Active Learners" },
                { icon: Award, value: "500+", label: "Challenges" },
                { icon: BarChart3, value: "95%", label: "Success Rate" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center lg:text-left px-3 py-2 rounded-lg bg-gray-800/30"
                >
                  <div className="flex items-center justify-center lg:justify-start mb-1">
                    <stat.icon className="w-4 h-4 text-cyan-400 mr-2" />
                    <span className="text-cyan-300 font-semibold">
                      {stat.value}
                    </span>
                  </div>
                  <span className="text-gray-500 text-xs">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Learning Paths */}
            <div>
              <h3 className="text-md font-semibold text-cyan-300 mb-4 flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-cyan-400" />
                Learning
              </h3>
              <ul className="space-y-2.5">
                {[
                  { name: "Beginner Track", path: "/paths/beginner" },
                  { name: "Advanced Topics", path: "/paths/advanced" },
                  { name: "Certification", path: "/paths/certification" },
                  { name: "Specializations", path: "/paths/specializations" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-cyan-400 transition-all duration-200 text-sm flex items-center group"
                    >
                      <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-md font-semibold text-cyan-300 mb-4 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-cyan-400" />
                Resources
              </h3>
              <ul className="space-y-2.5">
                {[
                  { name: "Blog & Articles", path: "/resources/blog" },
                  { name: "Video Tutorials", path: "/resources/videos" },
                  { name: "Cheat Sheets", path: "/resources/cheatsheets" },
                  { name: "Webinars", path: "/resources/webinars" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-cyan-400 transition-all duration-200 text-sm flex items-center group"
                    >
                      <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-md font-semibold text-cyan-300 mb-4 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-cyan-400" />
                Support
              </h3>
              <ul className="space-y-2.5">
                {[
                  { name: "Help Center", path: "/support/help" },
                  { name: "Community", path: "/support/forum" },
                  { name: "Contact", path: "/support/contact" },
                  { name: "FAQ", path: "/support/faq" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-cyan-400 transition-all duration-200 text-sm flex items-center group"
                    >
                      <ChevronRight className="w-3 h-3 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Middle section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14 border-t border-cyan-400/20 pt-12">
          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-cyan-400" />
              Why Choose CyberVeer?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  icon: ScanEye,
                  title: "Real-time Threats",
                  desc: "Identify emerging cyber threats",
                },
                {
                  icon: Binary,
                  title: "Hands-on Practice",
                  desc: "Practical exercises in safe environments",
                },
                {
                  icon: Clock,
                  title: "Self-Paced",
                  desc: "Progress at your own speed",
                },
                {
                  icon: Users,
                  title: "Community",
                  desc: "Join cybersecurity enthusiasts worldwide",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-3 rounded-lg hover:bg-gray-800/30 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-cyan-300 font-medium mb-1 text-sm group-hover:text-cyan-400 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-400 text-xs">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gray-800/30 rounded-xl p-6 border border-cyan-400/20 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center">
              <Terminal className="w-5 h-5 mr-2 text-cyan-400" />
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-5 text-sm">
              Get cybersecurity tips, threat alerts, and exclusive content.
            </p>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2.5 bg-gray-700/50 border border-cyan-400/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50 text-sm"
                />
                <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white py-2.5 px-4 rounded-lg transition-all duration-200 hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] border-0 text-sm">
                  Subscribe
                </Button>
              </div>
              <p className="text-gray-500 text-xs">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-cyan-400/20 pt-10">
          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-5">
            <div className="flex items-center text-gray-500 text-xs">
              <Code2 className="w-3 h-3 mr-1.5 text-cyan-400" />
              <span>Built with</span>
              <Heart className="w-3 h-3 mx-1.5 text-pink-500" />
              <span>by CyberVeer Team © {new Date().getFullYear()}</span>
            </div>

            {/* Social */}
            <div className="flex space-x-2">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Github, label: "GitHub" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Mail, label: "Email" },
              ].map((Social, index) => (
                <a
                  key={index}
                  href="#"
                  className="p-2 rounded-lg bg-gray-800/40 border border-cyan-400/20 text-gray-400 hover:text-cyan-400 transition-all duration-200 hover:border-cyan-400/30"
                  aria-label={Social.label}
                >
                  <Social.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-wrap justify-center gap-4">
            {["Privacy", "Terms", "Contact"].map((item, index) => (
              <Link
                key={index}
                to={`/${item.toLowerCase()}`}
                className="text-gray-500 hover:text-cyan-400 text-xs transition-all duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-6 left-6 text-cyan-400/5">
        <Cpu size={32} />
      </div>
      <div className="absolute top-6 right-6 text-purple-500/5">
        <Brain size={28} />
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent shadow-[0_0_5px_rgba(0,255,255,0.2)] animate-pulse" />
    </div>
  );
};

export default Footer;
