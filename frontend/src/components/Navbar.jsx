import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Shield } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const path = location.pathname;
  const navigation = [
    { name: 'Home', href: '/', current: path === '/' },
    { name: 'Categories', href: '/categories', current: path.startsWith('/categories') },
    { name: 'Blog', href: '/blog', current: path.startsWith('/blog') },
    { name: 'Quiz', href: '/quiz', current: path.startsWith('/quiz') },
    { name: 'About', href: '/about-us', current: path.startsWith('/about-us') },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur border-b border-border transition-all duration-300"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div
              className="flex items-center bg-card border border-border rounded-lg px-3 py-1 transition-all duration-200 group hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:scale-105"
              style={{ borderRadius: '0.5rem' }}
            >
              <Shield className="w-8 h-8 text-foreground group-hover:text-primary-foreground transition-all duration-200" />
              <span className="font-bold text-2xl tracking-tight text-foreground ml-2 group-hover:text-primary-foreground transition-all duration-200">
                CYBERVEER
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-1 py-2 text-sm font-bold transition-all duration-200 nav-rail ${item.current ? 'text-foreground' : 'text-muted-foreground'} flex-1 text-center`}
                data-active={item.current}
              >
                {item.name}
              </Link>
            ))}
            {/* Profile Button */}
            <Link
              to="/profile"
              className="ml-4 px-4 py-2 border border-border bg-card text-foreground font-bold rounded-lg flex items-center gap-2 transition-all duration-200 group hover:bg-primary hover:text-primary-foreground hover:scale-105"
              style={{ borderRadius: '0.75rem' }}
            >
              <User className="w-4 h-4 mr-2 text-foreground group-hover:text-primary-foreground transition-all duration-200" />
              <span className="group-hover:text-primary-foreground transition-all duration-200">
                PROFILE
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-foreground border border-border rounded-md hover:bg-primary hover:text-primary-foreground"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 border border-border bg-card rounded-lg shadow animate-slide-in overflow-hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-3 text-base font-bold rounded transition-all ${item.current ? 'text-foreground' : 'text-muted-foreground'} nav-rail`}
                  data-active={item.current}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-3 py-3 text-base font-bold text-foreground rounded mt-2 border-t border-border pt-4 hover:text-primary"
              >
                <User className="w-5 h-5 mr-3" />
                PROFILE
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
