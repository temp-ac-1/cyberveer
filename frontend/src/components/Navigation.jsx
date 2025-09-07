import { Link } from "react-router-dom";
import { Home, BarChart3, Shield } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-blue-600 flex items-center"
            >
              <Shield className="h-6 w-6 mr-2" />
              CyberQuiz
            </Link>
          </div>

          {/* Navigation links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition-colors flex items-center"
            >
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <Link
              to="/quiz"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Quizzes
            </Link>
            <Link to="/profile" className="text-blue-600 font-medium">
              Profile
            </Link>
            <Link
              to="/Blog"
              className="text-gray-700 hover:text-blue-600 transition-colors flex items-center"
            >
              <BarChart3 className="h-4 w-4 mr-1" />
              Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
