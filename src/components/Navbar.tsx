import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.svg";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userType, setUserType, resetFormData, clearChatHistory } = useAppContext();

  const resetState = () => {
    setUserType(null);
    resetFormData();
    clearChatHistory();
  };

  return (
    <nav className="glass shadow-md sticky top-0 z-50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" onClick={resetState} className="flex-shrink-0 flex items-center group">
              <img className="h-10 w-auto transition-all duration-300 group-hover:scale-110 group-hover:animate-float" src={logo} alt="Voluntify" />
              <span className="ml-3 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Voluntify</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/listings"
              className="text-base-content hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-primary/10"
            >
              Explore Opportunities
            </Link>
            <Link
              to="/register/seeker"
              className="text-base-content hover:text-accent px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-accent/10"
            >
              For Job Seekers
            </Link>
            <Link
              to="/register/employer"
              className="text-base-content hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-secondary/10"
            >
              For Employers
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-base-content hover:text-primary hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden glass shadow-lg border-t border-base-300`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/listings"
            className="text-base-content hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-primary/10"
            onClick={() => setIsMenuOpen(false)}
          >
            Explore Opportunities
          </Link>
          <Link
            to="/register/seeker"
            className="text-base-content hover:text-accent block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-accent/10"
            onClick={() => setIsMenuOpen(false)}
          >
            For Job Seekers
          </Link>
          <Link
            to="/register/employer"
            className="text-base-content hover:text-secondary block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 hover:bg-secondary/10"
            onClick={() => setIsMenuOpen(false)}
          >
            For Employers
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 