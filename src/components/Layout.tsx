import React from 'react';
import { NavLink } from 'react-router-dom';
import { Video, Upload, History, BookOpenText, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <BookOpenText className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LectureQuiz</span>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                Home
              </NavLink>
              <NavLink 
                to="/upload" 
                className={({ isActive }) => cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                Upload
              </NavLink>
              <NavLink 
                to="/history" 
                className={({ isActive }) => cn(
                  "px-3 py-2 rounded-md text-sm font-medium",
                  isActive 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                History
              </NavLink>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-4 space-y-1">
              <NavLink 
                to="/" 
                className={({ isActive }) => cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  isActive 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink 
                to="/upload" 
                className={({ isActive }) => cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  isActive 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Upload
              </NavLink>
              <NavLink 
                to="/history" 
                className={({ isActive }) => cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  isActive 
                    ? "bg-indigo-100 text-indigo-700" 
                    : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                History
              </NavLink>
            </div>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} LectureQuiz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;