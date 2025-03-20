import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { nova } from '../../services/ai/NovaAI';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  requiredLevel: number;
  skills: string[];
  tags: string[];
  impact: string;
  organization: {
    name: string;
    logo?: string;
  };
  matchScore: number;
}

interface MatchFilters {
  categories: string[];
  minLevel: number;
  skills: string[];
  remote: boolean;
}

export const OpportunityMatcher: React.FC = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filters, setFilters] = useState<MatchFilters>({
    categories: [],
    minLevel: 1,
    skills: [],
    remote: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [novaInsights, setNovaInsights] = useState('');

  // Mock data for demonstration
  const mockOpportunities: Opportunity[] = [
    {
      id: 'op1',
      title: 'AI for Climate Action',
      description: 'Help develop machine learning models to analyze climate data and predict environmental changes.',
      category: 'Technology',
      requiredLevel: 3,
      skills: ['Python', 'Machine Learning', 'Data Analysis'],
      tags: ['Climate Change', 'AI/ML', 'Environmental'],
      impact: 'Help combat climate change through data-driven solutions',
      organization: {
        name: 'Climate Tech Initiative',
        logo: '/logos/climate-tech.png'
      },
      matchScore: 92
    },
    {
      id: 'op2',
      title: 'Community Education Platform',
      description: 'Build an accessible education platform for underserved communities.',
      category: 'Education',
      requiredLevel: 2,
      skills: ['React', 'UI/UX', 'Education'],
      tags: ['Education', 'Social Impact', 'Web Development'],
      impact: 'Provide educational access to 1000+ students',
      organization: {
        name: 'EduAccess Foundation',
        logo: '/logos/edu-access.png'
      },
      matchScore: 88
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setOpportunities(mockOpportunities);
    
    // Get Nova's insights
    getNovaInsights();
  }, []);

  const getNovaInsights = async () => {
    setIsLoading(true);
    try {
      const response = await nova.interact(
        'Based on the available opportunities, what insights can you provide about the current needs and impact potential?'
      );
      setNovaInsights(response.message);
    } catch (error) {
      console.error('Error getting Nova insights:', error);
    }
    setIsLoading(false);
  };

  const handleFilterChange = (newFilters: Partial<MatchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Nova's Insights */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Nova's Insights</h2>
        <motion.div
          className="bg-gray-900/50 backdrop-blur-lg rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          ) : (
            <p className="text-gray-300">{novaInsights}</p>
          )}
        </motion.div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-gray-300">Categories</label>
            <select
              className="input w-full"
              multiple
              value={filters.categories}
              onChange={(e) => handleFilterChange({
                categories: Array.from(e.target.selectedOptions, option => option.value)
              })}
            >
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
              <option value="Environment">Environment</option>
              <option value="Social">Social</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-gray-300">Minimum Level</label>
            <input
              type="number"
              className="input w-full"
              min={1}
              max={10}
              value={filters.minLevel}
              onChange={(e) => handleFilterChange({ minLevel: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-gray-300">Skills</label>
            <select
              className="input w-full"
              multiple
              value={filters.skills}
              onChange={(e) => handleFilterChange({
                skills: Array.from(e.target.selectedOptions, option => option.value)
              })}
            >
              <option value="Python">Python</option>
              <option value="React">React</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="UI/UX">UI/UX</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-gray-300">Remote Only</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={filters.remote}
                onChange={(e) => handleFilterChange({ remote: e.target.checked })}
              />
              <span className="text-gray-300">Remote Opportunities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {opportunities.map((opportunity) => (
            <motion.div
              key={opportunity.id}
              className="bg-gray-900/50 backdrop-blur-lg rounded-lg overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {opportunity.title}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-400">
                        {opportunity.organization.name}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-400">
                        Level {opportunity.requiredLevel}+
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="text-2xl font-bold text-primary-500">
                      {opportunity.matchScore}
                    </div>
                    <div className="text-sm text-gray-400">%</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  {opportunity.description}
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-400 mb-2">
                      Required Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-400 mb-2">
                      Impact
                    </div>
                    <p className="text-gray-300 text-sm">
                      {opportunity.impact}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-800/50 flex justify-end">
                <button className="btn btn-primary">
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OpportunityMatcher; 