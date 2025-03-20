import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Background3D from '../components/common/Background3D';

interface Community {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  image: string;
  category: string;
  topics: string[];
  isFeatured?: boolean;
  relatedCommunities?: number[];
}

const CommunitiesScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredCommunity, setHoveredCommunity] = useState<number | null>(null);

  const categories = [
    'all',
    'technology',
    'design',
    'business',
    'science',
    'arts',
    'education'
  ];

  const formatMemberCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return count.toString();
  };

  const communities: Community[] = [
    {
      id: 1,
      name: "Estonia Tech Innovators",
      description: "A community for tech professionals in Estonia sharing knowledge, job opportunities, and supporting each other's growth.",
      memberCount: 1240,
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "technology",
      topics: ["Software Development", "AI", "Startups", "Web3"],
      isFeatured: true,
      relatedCommunities: [3, 8]
    },
    {
      id: 2,
      name: "UX/UI Design Enthusiasts",
      description: "Connect with fellow designers, share work, get feedback, and discover opportunities in the thriving Estonian design scene.",
      memberCount: 845,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "design",
      topics: ["UI Design", "UX Research", "User Testing", "Design Systems"],
      relatedCommunities: [6]
    },
    {
      id: 3,
      name: "Data Science Estonia",
      description: "For data scientists, analysts, and enthusiasts interested in data-driven decision making and advanced analytics.",
      memberCount: 620,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "technology",
      topics: ["Machine Learning", "Big Data", "Visualization", "Statistics"],
      relatedCommunities: [1, 5]
    },
    {
      id: 4,
      name: "Estonian Entrepreneurs",
      description: "Network with business leaders and entrepreneurs from Estonia's thriving startup ecosystem.",
      memberCount: 980,
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "business",
      topics: ["Startups", "Funding", "Business Development", "Networking"],
      isFeatured: true,
      relatedCommunities: [9]
    },
    {
      id: 5,
      name: "Healthcare Innovations",
      description: "Bringing together healthcare professionals and technologists to advance medical science and patient care.",
      memberCount: 520,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "science",
      topics: ["Medical Tech", "Biotechnology", "Health IT", "Research"],
      relatedCommunities: [3]
    },
    {
      id: 6,
      name: "Creative Arts Collective",
      description: "A space for artists, musicians, writers, and creatives to collaborate and share their work.",
      memberCount: 750,
      image: "https://images.unsplash.com/photo-1536924430914-91f9e2041b83?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "arts",
      topics: ["Visual Arts", "Music", "Writing", "Performance"],
      relatedCommunities: [2, 7]
    },
    {
      id: 7,
      name: "EdTech Innovators",
      description: "Educators and technologists collaborating to transform learning experiences through innovative technology.",
      memberCount: 410,
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "education",
      topics: ["E-learning", "Educational Apps", "Learning Management", "Assessment"],
      relatedCommunities: [6]
    },
    {
      id: 8,
      name: "Estonia Game Developers",
      description: "For game developers, designers, artists, and enthusiasts building the next generation of games.",
      memberCount: 380,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "technology",
      topics: ["Game Development", "3D Modeling", "Game Design", "Unity"],
      relatedCommunities: [1, 2]
    },
    {
      id: 9,
      name: "Sustainable Business Network",
      description: "Connecting businesses committed to sustainable practices and environmental responsibility.",
      memberCount: 290,
      image: "https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      category: "business",
      topics: ["Sustainability", "Green Business", "CSR", "Circular Economy"],
      relatedCommunities: [4]
    }
  ];

  const filteredCommunities = communities.filter(community => {
    const matchesCategory = activeCategory === 'all' || community.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const featuredCommunities = communities.filter(community => community.isFeatured);
  
  const getRelatedCommunities = (communityId: number) => {
    const community = communities.find(c => c.id === communityId);
    if (!community || !community.relatedCommunities) return [];
    
    return communities.filter(c => community.relatedCommunities?.includes(c.id));
  };

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
              <Link to="/success-stories" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Bridges We Build
              </Link>
              <Link to="/communities" className="px-3 py-2 rounded-lg bg-white/10 text-white">
                Communities - Hub
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
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400">Communities - Hub</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            There was a time when we came together to create, dream, and change the world. Why not bring that back? <br/>
            <span className="font-medium text-white mt-2 inline-block">
              Join communities that match your interests, grow your skills, connect with like-minded people, and launch new projects. If you don't find what you're looking for—create it!
            </span>
          </p>
        </motion.div>

        {/* Featured Communities */}
        {featuredCommunities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-6">Featured Communities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredCommunities.map(community => (
                <motion.div
                  key={community.id}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(100,149,237,0.3)" }}
                  className="bg-gray-900/40 backdrop-blur-md p-6 rounded-xl overflow-hidden shadow-xl border-l-4 border-blue-500 flex"
                  onMouseEnter={() => setHoveredCommunity(community.id)}
                  onMouseLeave={() => setHoveredCommunity(null)}
                >
                  <img 
                    src={community.image} 
                    alt={community.name} 
                    className="w-24 h-24 rounded-lg object-cover mr-4 border border-white/10" 
                  />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{community.name}</h3>
                      <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                        {formatMemberCount(community.memberCount)} members
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{community.description}</p>
                    <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                      Join Community →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="md:flex-grow">
              <input
                type="text"
                placeholder="Search communities..."
                className="w-full p-3 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex overflow-x-auto py-2 md:py-0 glass rounded-lg">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 whitespace-nowrap rounded-md transition-colors ${
                    activeCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.length > 0 ? (
            filteredCommunities.map(community => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * (community.id % 6) }}
                className="bg-gray-900/40 backdrop-blur-md p-6 rounded-xl overflow-hidden shadow-xl border-t-4 border-blue-500"
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 0 25px rgba(100,149,237,0.2)",
                  backgroundColor: "rgba(30, 30, 50, 0.6)"
                }}
                onMouseEnter={() => setHoveredCommunity(community.id)}
                onMouseLeave={() => setHoveredCommunity(null)}
              >
                <img 
                  src={community.image} 
                  alt={community.name} 
                  className="w-full h-40 object-cover -mt-6 -mx-6 mb-4 border-b border-white/10" 
                />
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{community.name}</h3>
                  <span className="text-sm bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                    {formatMemberCount(community.memberCount)} members
                  </span>
                </div>
                <p className="text-gray-300 mb-4">{community.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {community.topics.map((topic, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-300">
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Join Community
                  </button>
                  <button className="text-white/50 hover:text-white/80 text-sm transition-colors">
                    Learn More →
                  </button>
                </div>
                
                {/* Related Communities Section (visible on hover) */}
                {hoveredCommunity === community.id && community.relatedCommunities && community.relatedCommunities.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <h4 className="text-sm font-semibold mb-2 text-gray-300">Related Communities:</h4>
                    <div className="flex flex-wrap gap-2">
                      {getRelatedCommunities(community.id).map(related => (
                        <button 
                          key={related.id}
                          className="text-xs px-2 py-1 bg-blue-500/10 rounded-full text-blue-300 hover:bg-blue-500/20 transition-colors"
                        >
                          {related.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-400 text-lg">No communities match your filter criteria. Try a different category or search term.</p>
            </div>
          )}
        </div>
        
        {/* Create Community CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 text-center p-8 bg-gradient-to-r from-blue-900/40 to-purple-900/40 backdrop-blur-md rounded-xl"
        >
          <h2 className="text-3xl font-bold mb-4">Don't see what you're looking for?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Build your own community and connect with like-minded individuals. We'll help you grow and thrive together.
          </p>
          <button className="px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-white font-medium">
            Create a Community
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default CommunitiesScreen; 