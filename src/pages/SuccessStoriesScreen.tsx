import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Background3D from '../components/common/Background3D';

interface SuccessStory {
  id: number;
  title: string;
  description: string;
  author: string;
  role: string;
  image: string;
  category: 'seeker' | 'inspirator';
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
  shortTestimonial?: string;
}

const SuccessStoriesScreen: React.FC = () => {
  const [filter, setFilter] = React.useState<'all' | 'seeker' | 'inspirator'>('all');
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const storiesContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  
  // Auto-scrolling effect
  useEffect(() => {
    if (!autoScroll || !storiesContainerRef.current) return;
    
    const container = storiesContainerRef.current;
    let scrollInterval: ReturnType<typeof setInterval>;
    
    // Only start auto-scrolling if content width exceeds container width
    if (container.scrollWidth > container.clientWidth) {
      scrollInterval = setInterval(() => {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
          // Reset to start when reached the end
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll a little bit to the right
          container.scrollBy({ left: 200, behavior: 'smooth' });
        }
      }, 5000);
    }
    
    return () => clearInterval(scrollInterval);
  }, [autoScroll, filter]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!storiesContainerRef.current) return;
    
    // Temporarily disable auto-scrolling when manually scrolling
    setAutoScroll(false);
    
    const container = storiesContainerRef.current;
    const scrollAmount = 350; // Adjust as needed
    
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    
    // Re-enable auto-scrolling after a delay
    setTimeout(() => setAutoScroll(true), 5000);
  };

  const successStories: SuccessStory[] = [
    {
      id: 1,
      title: "From Bootcamp to Senior Developer in 2 Years",
      description: "After completing a coding bootcamp, I struggled to find opportunities that would accept someone without a formal degree. Through Dots, I connected with a startup that valued passion over credentials. They took a chance on me, and with their mentorship, I've grown from a junior to a senior developer in just two years.",
      author: "Marten Kask",
      role: "Senior Frontend Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "seeker",
      shortTestimonial: "Dots transformed my career by connecting me with people who saw my potential.",
      socialLinks: {
        linkedin: "https://linkedin.com/in/example",
        twitter: "https://twitter.com/example"
      }
    },
    {
      id: 2,
      title: "Building a Design Team from Scratch",
      description: "As a startup founder, I needed to build a design team quickly but didn't have the network or resources to find the right talent. Dots connected me with passionate designers who were looking to make an impact. Today, our design team has won multiple awards, and several of those early hires are now in leadership positions.",
      author: "Liisa Tamm",
      role: "CEO, DesignFlow",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "inspirator",
      shortTestimonial: "Dots helped me build an award-winning design team from the ground up.",
      socialLinks: {
        linkedin: "https://linkedin.com/in/example2"
      }
    },
    {
      id: 3,
      title: "Career Pivot into Data Science",
      description: "After 10 years in finance, I wanted to transition into data science but didn't know where to start. Through Dots, I found a mentor who guided my learning journey and introduced me to a part-time role where I could apply my new skills while still working my day job. Six months later, I made a full transition into a data science role I love.",
      author: "Tõnu Rebane",
      role: "Data Scientist",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "seeker",
      shortTestimonial: "Finding the right mentor through Dots made my career transition smooth and exciting.",
      socialLinks: {
        linkedin: "https://linkedin.com/in/example3",
        twitter: "https://twitter.com/example3"
      }
    },
    {
      id: 4,
      title: "Mentoring Program that Transformed Our Company",
      description: "We started a mentorship program through Dots to give back to the community, but it ended up transforming our company culture. The fresh perspectives and enthusiasm from the individuals we mentored brought new energy to our teams. We've since hired three of our mentees full-time, and they're now among our top performers.",
      author: "Kati Pärn",
      role: "HR Director, TechEesti",
      image: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "inspirator",
      shortTestimonial: "What started as giving back became a transformative program for our company.",
      socialLinks: {
        linkedin: "https://linkedin.com/in/example4"
      }
    },
    {
      id: 5,
      title: "From Self-taught to Professional UI/UX Designer",
      description: "I was a self-taught designer with a passion for creating intuitive user interfaces but no formal portfolio or connections. Dots matched me with a mentor who helped refine my skills and introduced me to collaborative projects. After just a few months, I received multiple job offers and now work as a full-time UI/UX designer.",
      author: "Kristjan Mägi",
      role: "UI/UX Designer",
      image: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "seeker",
      shortTestimonial: "Dots connected me with projects that turned my passion into a profession.",
      socialLinks: {
        twitter: "https://twitter.com/example5"
      }
    },
    {
      id: 6,
      title: "Finding Top Talent for Remote Work",
      description: "When our company transitioned to remote-first, we struggled to find top talent who could thrive in a distributed environment. Through Dots, we connected with motivated individuals who had the perfect mix of technical skills and self-direction. Our remote team is now more productive than our office was, and we've expanded into new markets.",
      author: "Siim Lepik",
      role: "CTO, RemoteForce",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "inspirator",
      shortTestimonial: "Dots helped us find the perfect remote talent and expand our global reach.",
      socialLinks: {
        linkedin: "https://linkedin.com/in/example6",
        twitter: "https://twitter.com/example6"
      }
    }
  ];

  const filteredStories = filter === 'all' 
    ? successStories 
    : successStories.filter(story => story.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-indigo-950 text-white flex flex-col">
      <Background3D />
      {/* Header with navigation */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-2xl font-bold">Dots</Link>
            <nav className="flex space-x-4">
              <Link to="/" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Home
              </Link>
              <Link to="/seekers" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Seekers
              </Link>
              <Link to="/inspirators" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Inspirators
              </Link>
              <Link to="/success-stories" className="px-3 py-2 rounded-lg bg-white/10 text-white">
                Bridges We Build
              </Link>
              <Link to="/communities" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Communities
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400">Bridges We Build</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how Dots has connected passionate individuals with opportunities and mentors, creating meaningful bridges that transform careers and lives.
          </p>
        </motion.div>

        {/* Filter buttons */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 glass rounded-lg">
            <button
              className={`px-6 py-2 rounded-md transition-colors ${
                filter === 'all' ? 'bg-purple-600 text-white' : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setFilter('all')}
            >
              All Stories
            </button>
            <button
              className={`px-6 py-2 rounded-md transition-colors ${
                filter === 'seeker' ? 'bg-purple-600 text-white' : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setFilter('seeker')}
            >
              Seeker Stories
            </button>
            <button
              className={`px-6 py-2 rounded-md transition-colors ${
                filter === 'inspirator' ? 'bg-green-600 text-white' : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setFilter('inspirator')}
            >
              Inspirator Stories
            </button>
          </div>
        </div>

        {/* Horizontal scroll navigation */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Featured Stories</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleScroll('left')}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Scroll left"
            >
              <FaArrowLeft />
            </button>
            <button 
              onClick={() => handleScroll('right')}
              className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Scroll right"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Horizontal scrolling stories */}
        <div 
          ref={storiesContainerRef}
          className="flex overflow-x-auto pb-8 space-x-6 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredStories.map(story => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (story.id % 6) }}
              className={`bg-gray-900/40 backdrop-blur-md rounded-xl overflow-hidden shadow-xl border-t-4 flex-shrink-0 w-[350px] snap-start ${
                story.category === 'seeker' ? 'border-purple-500' : 'border-green-500'
              }`}
              whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 0 25px rgba(255,255,255,0.15)",
                backgroundColor: "rgba(30, 30, 50, 0.6)"
              }}
              onMouseEnter={() => setActiveStory(story.id)}
              onMouseLeave={() => setActiveStory(null)}
            >
              <div className="p-6 relative h-full flex flex-col">
                {/* Short testimonial that appears on hover */}
                {activeStory === story.id && story.shortTestimonial && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-b from-gray-900/90 to-gray-900/90 z-10"
                  >
                    <p className="text-xl font-medium text-center text-white">"{story.shortTestimonial}"</p>
                  </motion.div>
                )}
                
                <div className="flex items-center mb-6 z-20">
                  <img 
                    src={story.image} 
                    alt={story.author} 
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white/20" 
                  />
                  <div>
                    <h3 className="font-bold text-white">{story.author}</h3>
                    <p className="text-sm text-gray-300">{story.role}</p>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-4 text-white">{story.title}</h2>
                <p className="text-gray-300 mb-6 flex-grow">{story.description}</p>
                
                <div className="flex justify-between items-center mt-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    story.category === 'seeker' 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'bg-green-500/20 text-green-300'
                  }`}>
                    {story.category === 'seeker' ? 'Seeker' : 'Inspirator'}
                  </span>
                  
                  <div className="flex space-x-2">
                    {story.socialLinks?.linkedin && (
                      <a href={story.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
                         className="text-gray-400 hover:text-blue-400 transition-colors">
                        <FaLinkedin />
                      </a>
                    )}
                    {story.socialLinks?.twitter && (
                      <a href={story.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                         className="text-gray-400 hover:text-blue-400 transition-colors">
                        <FaTwitter />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Custom CSS for hiding scrollbar */}
        <style>
          {`.hide-scrollbar::-webkit-scrollbar {
            display: none;
          }`}
        </style>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to create your own bridge to success?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/seekers" className="px-8 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
              Start as a Seeker
            </Link>
            <Link to="/inspirators" className="px-8 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
              Start as an Inspirator
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SuccessStoriesScreen; 