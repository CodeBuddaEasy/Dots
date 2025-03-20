import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Background3D from '../components/common/Background3D';

interface FilterOptions {
  skills: string[];
  experience: string[];
  availability: string[];
  passion: string[];
}

interface OpportunityForm {
  title: string;
  description: string;
  requirements: string;
  location: string;
  type: string;
  contactEmail: string;
  peopleNeeded: string;
  startDate: string;
  endDate: string;
  projectDescription: string;
}

const InspiratorsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'filter' | 'post'>('filter');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    skills: [],
    experience: [],
    availability: [],
    passion: []
  });

  const [opportunityForm, setOpportunityForm] = useState<OpportunityForm>({
    title: '',
    description: '',
    requirements: '',
    location: '',
    type: 'Full-time',
    contactEmail: '',
    peopleNeeded: '1',
    startDate: '',
    endDate: '',
    projectDescription: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const filterOptions: FilterOptions = {
    skills: ['Programming', 'Design', 'Writing', 'Marketing', 'Data Analysis', 'Communication', 'Leadership'],
    experience: ['Entry-level', 'Mid-level', 'Senior', 'Expert'],
    availability: ['Full-time', 'Part-time', 'Project-based', 'Weekends only'],
    passion: ['Technology', 'Healthcare', 'Education', 'Environment', 'Arts', 'Social Impact']
  };

  const opportunityTypes = ['Full-time', 'Part-time', 'Internship', 'Mentorship', 'Project-based', 'Volunteering'];
  const peopleNeededOptions: string[] = ['1', '2-5', '6-10', '11-20', '20+'];

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters(prev => {
      const currentFilters = [...prev[category]];
      const index = currentFilters.indexOf(value);

      if (index === -1) {
        return { ...prev, [category]: [...currentFilters, value] };
      } else {
        currentFilters.splice(index, 1);
        return { ...prev, [category]: currentFilters };
      }
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOpportunityForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // In a real app, you would send this data to your backend
    console.log('Opportunity submitted:', opportunityForm);
  };

  const resetForm = () => {
    setOpportunityForm({
      title: '',
      description: '',
      requirements: '',
      location: '',
      type: 'Full-time',
      contactEmail: '',
      peopleNeeded: '1',
      startDate: '',
      endDate: '',
      projectDescription: ''
    });
    setIsSubmitted(false);
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
              <Link to="/inspirators" className="px-3 py-2 rounded-lg bg-white/10 text-white">
                Inspirators
              </Link>
              <Link to="/success-stories" className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5">
                Success Stories
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
          <h1 className="text-5xl font-bold mb-4">Inspirators' Journey</h1>
          <p className="text-xl text-gray-300">Find passionate individuals and create opportunities</p>
        </motion.div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 glass rounded-lg">
            <button
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'filter' ? 'bg-green-600 text-white' : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setActiveTab('filter')}
            >
              Find Talent
            </button>
            <button
              className={`px-6 py-2 rounded-md transition-colors ${
                activeTab === 'post' ? 'bg-green-600 text-white' : 'text-white/70 hover:text-white'
              }`}
              onClick={() => setActiveTab('post')}
            >
              Post Opportunity
            </button>
          </div>
        </div>

        {/* Content area */}
        <AnimatePresence mode="wait">
          {activeTab === 'filter' ? (
            <motion.div
              key="filter"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto"
            >
              <div className="glass p-8 rounded-xl shadow-xl mb-8">
                <h2 className="text-2xl font-bold mb-6">Find Your Perfect Match</h2>
                <p className="text-gray-300 mb-8">
                  Use these filters to find individuals who match your organization's needs and values.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(filterOptions).map(([category, options]) => (
                    <div key={category} className="space-y-4">
                      <h3 className="text-lg font-semibold capitalize">{category}</h3>
                      <div className="space-y-2">
                        {options.map(option => (
                          <label key={option} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              className="form-checkbox rounded text-green-500 bg-gray-800 border-gray-600"
                              checked={selectedFilters[category].includes(option)}
                              onChange={() => toggleFilter(category, option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <motion.button
                    className="px-8 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Find Matches
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="post"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="glass p-8 rounded-xl shadow-xl">
                {!isSubmitted ? (
                  <>
                    <h2 className="text-2xl font-bold mb-6">Post a New Opportunity</h2>
                    <p className="text-gray-300 mb-8">
                      Share details about your opportunity to attract the right talent.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">Opportunity Title</label>
                        <input
                          type="text"
                          name="title"
                          value={opportunityForm.title}
                          onChange={handleFormChange}
                          required
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:border-green-500"
                          placeholder="e.g., UI/UX Design Internship"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                          name="description"
                          value={opportunityForm.description}
                          onChange={handleFormChange}
                          required
                          rows={4}
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:border-green-500"
                          placeholder="Describe the opportunity, responsibilities, and what makes it unique..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Requirements</label>
                        <textarea
                          name="requirements"
                          value={opportunityForm.requirements}
                          onChange={handleFormChange}
                          rows={3}
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:border-green-500"
                          placeholder="Skills, experience, or qualities you're looking for..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Location</label>
                          <input
                            type="text"
                            name="location"
                            value={opportunityForm.location}
                            onChange={handleFormChange}
                            className="w-full p-3 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:border-green-500"
                            placeholder="Remote, City, or Hybrid"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Opportunity Type</label>
                          <select
                            name="type"
                            value={opportunityForm.type}
                            onChange={handleFormChange}
                            className="w-full p-3 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:border-green-500"
                          >
                            {opportunityTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Contact Email</label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={opportunityForm.contactEmail}
                          onChange={handleFormChange}
                          required
                          className="w-full p-3 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:border-green-500"
                          placeholder="Where applicants can reach you"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Number of People Needed</label>
                          <select
                            name="peopleNeeded"
                            value={opportunityForm.peopleNeeded}
                            onChange={handleFormChange}
                            className="w-full p-3 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:border-green-500"
                          >
                            {peopleNeededOptions.map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Project Description</label>
                          <input
                            type="text"
                            name="projectDescription"
                            value={opportunityForm.projectDescription}
                            onChange={handleFormChange}
                            className="w-full p-3 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:border-green-500"
                            placeholder="Brief project description"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            value={opportunityForm.startDate}
                            onChange={handleFormChange}
                            className="w-full p-3 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:border-green-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">End Date (if applicable)</label>
                          <input
                            type="date"
                            name="endDate"
                            value={opportunityForm.endDate}
                            onChange={handleFormChange}
                            className="w-full p-3 bg-gray-800/50 rounded-lg border border-white/10 focus:outline-none focus:border-green-500"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <motion.button
                          type="submit"
                          className="w-full py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Post Opportunity
                        </motion.button>
                      </div>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Opportunity Posted!</h2>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">
                      Your opportunity has been successfully posted. We'll notify you when potential matches express interest.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                      <motion.button
                        className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetForm}
                      >
                        Post Another
                      </motion.button>
                      <motion.button
                        className="px-6 py-3 glass rounded-lg hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('filter')}
                      >
                        Find Talent
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default InspiratorsScreen; 